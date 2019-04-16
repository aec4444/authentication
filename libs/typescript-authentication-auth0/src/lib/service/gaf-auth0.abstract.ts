import {
  GafAuthentication,
  GafTokenManager,
  GafStorageManager,
  GafAuthenticationMode
} from '@gaf/typescript-authentication-general';
import { GafAuth0Settings } from '../config/gaf-auth0-settings';
import { GafAuth0Callbacks } from '../config/gaf-auth0-callbacks';
import { IGafAuth0 } from './IGafAuth0';
import { WindowLocation } from '../helpers/window-location';
import { GafJwtHelper } from '@gaf/typescript-jwt';
import { GafAuth0Session } from '../models/GafAuth0Session';
import { IGafPromiseFunctions } from '../models/IGafPromiseFunctions';
import { GafAuth0Setup } from '../helpers/gaf-auth0-setup';
import { GeneralHelpers } from '../helpers/general-helpers';

export abstract class GafAuth0 extends GafAuthentication implements IGafAuth0 {
  protected _jwtHelper!: GafJwtHelper;
  protected _timeoutPointer: number | undefined;
  protected _initialRenewIdTokenPromise!: Promise<boolean>;
  protected _setup!: GafAuth0Setup;

  constructor(
    public config: GafAuth0Settings,
    public callbacks: GafAuth0Callbacks,
    protected tokenManager: GafTokenManager,
    public storage: GafStorageManager,
    protected windowLocation: WindowLocation
  ) {
    super(storage);

    this._jwtHelper = new GafJwtHelper();
    this._setup = new GafAuth0Setup(this.windowLocation);
  }

  //#region protected functions to share
  protected areScopesProvided(): boolean {
    const scopes = this.config.scopes;
    return scopes !== undefined && scopes !== null && scopes.length >= 0;
  }

  protected isSingleAudience(): boolean {
    const scopes = this.config.scopes;
    return this.areScopesProvided() && typeof scopes[0] === 'string';
  }

  protected isChildMode(): boolean {
    return (
      this.config.mode === undefined ||
      this.config.mode === GafAuthenticationMode.Child
    );
  }

  protected getChildRedirectUri(): string {
    if (
      this.config.loginUri !== undefined &&
      this.config.loginUri !== null &&
      this.config.loginUri !== ''
    ) {
      return `${this.config.loginUri}?redirectURL=${
        this.windowLocation.pathname
      }`;
    }
    return undefined;
  }

  /**
   * Load positive result into session
   * @param result result from Auth0
   */
  protected setAuthSession(result: any) {
    if (
      result !== undefined &&
      result !== null &&
      result.idTokenPayload !== undefined &&
      result.idTokenPayload !== null
    ) {
      const info = new GafAuth0Session();
      info.accessToken = result.accessToken;
      info.idToken = result.idToken;

      if (result && result.refreshToken) {
        info.refreshToken = result.refreshToken;
      }

      info.profile = {
        email: result.idTokenPayload['email'],
        firstName: result.idTokenPayload['given_name'],
        lastName: result.idTokenPayload['family_name'],
        nickname: result.idTokenPayload['nickname'],
        name: result.idTokenPayload['name']
      };
      this.storage.info = info;
    }

    // whenever we update this information, reschedule the ID token refresh based on the new token
    this.scheduleRenewal();
  }

  /**
   * Callback from Auth0 checkSession
   * @param err Err from Auth0
   * @param result Result from Auth0
   * @param promise Promise Resolve/Reject if needed
   */
  protected checkSessionCallback(
    err: any,
    result: any,
    promise?: IGafPromiseFunctions
  ) {
    if (err) {
      // if we have an error, call login
      this.login();

      // also call the reject state
      if (promise && promise.reject) {
        promise.reject(false);
      }
    } else {
      // save this information in session
      if (result !== undefined && result !== null) {
        this.setAuthSession(result);

        // if this is a single audience, save the access token in the cache as well
        if (!this.areScopesProvided() || this.isSingleAudience()) {
          this.tokenManager.set(this.config.audience, result.accessToken);
        }
      }

      // call the resolve state
      if (promise && promise.resolve) {
        promise.resolve(true);
      }
    }
  }

  protected getStandardPromiseFunction(
    promise?: IGafPromiseFunctions
  ): IGafPromiseFunctions {
    // create an empty promise object if one does not exist
    if (promise === undefined || promise === null) {
      promise = {};
    }

    // see if we are logged in at this moment.  If not, when we do log in we can emit event.
    const loggedIn = this.isAuthenticated;

    // call the resolve configured outside of this method but also
    // emit the successful login event.
    const oldResolve = promise.resolve;
    promise.resolve = (value: boolean) => {
      if (typeof oldResolve === 'function') {
        oldResolve(value);
      }

      // if not logged in, then we will emit message if in child mode
      if (
        !loggedIn &&
        typeof this.callbacks.onAuthenticationChanged === 'function'
      ) {
        this.callbacks.onAuthenticationChanged(true);
      }
    };

    return promise;
  }

  /**
   * Clear session information from storage for auth0 settings
   */
  protected clearSessionInfo(): void {
    this.storage.clear();
    if (this._timeoutPointer !== undefined) {
      clearTimeout(this._timeoutPointer);
    }
  }

  /**
   * Schedule renewals of the id token
   */
  protected scheduleRenewal(): void {
    if (
      this.config.setupRefreshTimers === undefined ||
      this.config.setupRefreshTimers === true
    ) {
      // determine length of time that can be used for renewal scheduling.
      // use the token and the threshold
      const sessionInfo = this.storage.info;
      if (
        sessionInfo !== undefined &&
        sessionInfo !== null &&
        !GeneralHelpers.isNullOrEmpty(sessionInfo.accessToken)
      ) {
        const threshold = this.config.idTokenThreshold || 30 * 1000; // 30 seconds by default
        const expirationTime = this._jwtHelper
          .getTokenExpirationDate(sessionInfo.idToken)
          .getTime();
        const nowTime = new Date().getTime();
        const timerLength = expirationTime - nowTime - threshold;

        if (timerLength <= 0) {
          this.renewIdToken();
        } else {
          this._timeoutPointer = window.setTimeout(() => {
            this.renewIdToken();
          }, timerLength);
        }
      }
    }
  }
  //#endregion

  //#region Protected abstract interface
  protected abstract renewIdToken(promise?: IGafPromiseFunctions): void;
  //#endregion

  //#region Public interfaces
  /**
   * Login to Auth0
   */
  public start(): void {
    // if we are authenticated already, set tokens correctly
    if (this.isAuthenticated) {
      // if we are single audience, we could use the access token.  Next time we try
      // to actually use the token in a request, we will check if expired.
      if (this.isSingleAudience()) {
        this.tokenManager.set(
          this.config.audience,
          this.storage.info.accessToken
        );
      }

      // mark our initial refresh state as resolved
      this._initialRenewIdTokenPromise = Promise.resolve(true);
      this.scheduleRenewal();

      if (typeof this.callbacks.onAuthenticationChanged === 'function') {
        this.callbacks.onAuthenticationChanged(true);
      }
    } else {
      // set a promise that will be driven by the refresh of the id token.
      // this allows us to WAIT on all requests until the ID token is done.
      this._initialRenewIdTokenPromise = new Promise((resolve, reject) => {
        this.renewIdToken({
          resolve: () => resolve(true),
          reject: () => reject(false)
        });
      });
    }
  }

  /**
   * Is the user authenticated?
   */
  public get isAuthenticated(): boolean {
    // check to see if we are still authenticated
    const sessionInfo = this.storage.info;
    if (
      sessionInfo === undefined ||
      sessionInfo === null ||
      GeneralHelpers.isNullOrEmpty(sessionInfo.idToken)
    ) {
      return false;
    }

    // check if the token has expired.
    return !this._jwtHelper.isTokenExpired(sessionInfo.idToken);
  }

  /**
   * Get the email address from the session storage for other usages
   */
  public getEmail(): string {
    if (this.isAuthenticated) {
      return this.storage.info.profile === undefined
        ? ''
        : this.storage.info.profile.email;
    }

    return '';
  }

  /**
   * Get Access Token for a given url
   * @param url The url we are attempting to get the access token for
   */
  public getAccessToken(url?: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this._initialRenewIdTokenPromise.then(() => {
        // determine if this is as single audience scope definition
        const key = this.config.audience;

        // if we do not get a key, we have an error state.
        if (key === undefined || key === null || key === '') {
          if (typeof this.callbacks.onRenewError === 'function') {
            this.callbacks.onRenewError('Audience String Is Missing');
          }
          resolve();
        } else {
          // let's attempt to get the token from cache... if we can, and it's not expired, just use it
          const item = this.tokenManager.get(
            key,
            this.config.accessTokenThreshold
          );

          // if we have a token, use it
          if (item !== undefined) {
            resolve(item.value);

            // if this is single audience, we can just call renewIdToken again with a callback
          } else {
            // get the access token here.
            // renew the id and access tokens here
            this.renewIdToken({
              resolve: () => resolve(this.storage.info.accessToken),
              reject: () => resolve()
            });
          }
        }
      });
    });
  }
  //#endregion
}
