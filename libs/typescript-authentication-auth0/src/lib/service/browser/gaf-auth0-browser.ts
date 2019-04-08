// angular and 3rd party imports
import * as auth0 from 'auth0-js';

// app imports
import { GafAuth0Settings, GafAuth0SettingsAudienceScope } from '../../config/gaf-auth0-settings';
import { GafAuth0Callbacks } from '../../config/gaf-auth0-callbacks';
import { GafTokenManager, GafAuthenticationMode, GafStorageManager } from '@gaf/typescript-authentication-general';
import { GafAuth0Setup } from '../../helpers/gaf-auth0-setup';
import { GafJwtHelper } from '@gaf/typescript-jwt';
import { GafAuth0 } from '../gaf-auth0.abstract';
import { GafAuth0Session } from '../../models/GafAuth0Session';
import { IGafPromiseFunctions } from '../../models/IGafPromiseFunctions';
import { GeneralHelpers } from '../../helpers/general-helpers';
import { WindowLocation } from '../../helpers/window-location';

export class GafAuth0Browser extends GafAuth0 {
  //#region configure auth0 WebAuth
  private _auth0WebAuth: auth0.WebAuth;
  private _setup!: GafAuth0Setup;
  private _jwtHelper!: GafJwtHelper;
  private _timeoutPointer: number | undefined;
  private _initialRenewIdTokenPromise!: Promise<boolean>;

  //#endregion
  constructor(
    public config: GafAuth0Settings,
    public callbacks: GafAuth0Callbacks,
    protected tokenManager: GafTokenManager,
    public storage: GafStorageManager,
    private windowLocation?: WindowLocation,
  ) {
    super(config, callbacks, tokenManager, storage);

    if (this.windowLocation === undefined) {
      this.windowLocation = new WindowLocation();
    }

    this._jwtHelper = new GafJwtHelper();
    this._setup = new GafAuth0Setup(this.windowLocation);
    this._auth0WebAuth = this.createWebAuth();
    this._setup.configureEventListener();
  }

  //#region private functions
  private createWebAuth(): auth0.WebAuth {
    return this._setup.createWebAuth(this.config, this.isSingleAudience());
  }

  private areScopesProvided(): boolean {
    const scopes = this.config.scopes;
    return scopes !== undefined && scopes !== null && scopes.length >= 0;
  }

  private isSingleAudience(): boolean {
    const scopes = this.config.scopes;
    return this.areScopesProvided() && typeof scopes[0] === 'string';
  }

  private isChildMode(): boolean {
    return this.config.mode === undefined || this.config.mode === GafAuthenticationMode.Child;
  }

  private getChildRedirectUri(): string {
    if (this.config.loginUri !== undefined && this.config.loginUri !== null && this.config.loginUri !== '') {
      return `${this.config.loginUri}?redirectURL=${this.windowLocation.pathname}`;
    }
    return undefined;
  }

  /**
   * Load positive result into session
   * @param result result from Auth0
   */
  private setAuthSession(result: any) {
    if (
      result !== undefined &&
      result !== null &&
      result.idTokenPayload !== undefined &&
      result.idTokenPayload !== null
    ) {
      const info = new GafAuth0Session();
      info.accessToken = result.accessToken;
      info.idToken = result.idToken;
      info.profile = {
        email: result.idTokenPayload['email'],
        firstName: result.idTokenPayload['given_name'],
        lastName: result.idTokenPayload['family_name'],
        nickname: result.idTokenPayload['nickname'],
        name: result.idTokenPayload['name'],
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
  private checkSessionCallback(err: any, result: any, promise?: IGafPromiseFunctions) {
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

  private getStandardPromiseFunction(promise?: IGafPromiseFunctions): IGafPromiseFunctions {
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
      if (!loggedIn && typeof this.callbacks.onAuthenticationChanged === 'function') {
        this.callbacks.onAuthenticationChanged(true);
      }
    };

    return promise;
  }
  /**
   * Renew the ID token
   * @param promise Promise resolve and reject functions to call
   */
  private renewIdToken(promise?: IGafPromiseFunctions): void {
    const promiseNew = this.getStandardPromiseFunction(promise);

    this._auth0WebAuth.checkSession({}, (err: any, result: any) => this.checkSessionCallback(err, result, promiseNew));
  }

  /**
   * Schedule renewals of the id token
   */
  private scheduleRenewal(): void {
    // determine length of time that can be used for renewal scheduling.
    // use the token and the threshold
    const sessionInfo = this.storage.info;
    if (sessionInfo !== undefined && sessionInfo !== null && !GeneralHelpers.isNullOrEmpty(sessionInfo.accessToken)) {
      const threshold = this.config.idTokenThreshold || 30 * 1000; // 30 seconds by default
      const expirationTime = this._jwtHelper.getTokenExpirationDate(sessionInfo.idToken).getTime();
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

  /**
   * Clear session information from storage for auth0 settings
   */
  private clearSessionInfo(): void {
    this.storage.clear();
    if (this._timeoutPointer !== undefined) {
      clearTimeout(this._timeoutPointer);
    }
  }
  //#endregion

  //#region Public Interface
  /**
   * Login to Auth0
   */
  public start(): void {
    // if we are authenticated already, set tokens correctly
    if (this.isAuthenticated) {
      // if we are single audience, we could use the access token.  Next time we try
      // to actually use the token in a request, we will check if expired.
      if (this.isSingleAudience()) {
        this.tokenManager.set(this.config.audience, this.storage.info.accessToken);
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
        this.renewIdToken({ resolve: () => resolve(true), reject: () => reject(false) });
      });
    }
  }

  public login(): void {
    this.clearSessionInfo(); // clear the session just in case.

    // if child mode, send back to the parent.  If parent mode, go to authorize
    if (this.isChildMode()) {
      const redirectUri = this.getChildRedirectUri();
      if (redirectUri !== undefined) {
        this.windowLocation.assign(this.getChildRedirectUri());
      }
    } else {
      this._auth0WebAuth.authorize({ redirectUri: this.config.redirectUri });
    }
  }

  /**
   * Logout and issue logout command
   */
  public logout(): void {
    this.clearSessionInfo();

    if (typeof this.callbacks.onAuthenticationChanged === 'function') {
      this.callbacks.onAuthenticationChanged(false);
    }

    // if this is not child mode, then you need to log out from auth0 as well
    if (!this.isChildMode() && this.config.logoutUri !== undefined) {
      this._auth0WebAuth.logout({
        returnTo: this.config.logoutUri,
        clientID: this.config.clientId,
      });
    }
  }

  /**
   * Is the user authenticated?
   */
  public get isAuthenticated(): boolean {
    // check to see if we are still authenticated
    const sessionInfo = this.storage.info;
    if (sessionInfo === undefined || sessionInfo === null || GeneralHelpers.isNullOrEmpty(sessionInfo.idToken)) {
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
      return this.storage.info.profile === undefined ? '' : this.storage.info.profile.email;
    }

    return '';
  }

  /**
   * Get Access Token for a given url
   * @param url The url we are attempting to get the access token for
   */
  public getAccessToken(url?: string): Promise<string> {
    const promise = new Promise<string>((resolve, reject) => {
      this._initialRenewIdTokenPromise.then(() => {
        // determine if this is as single audience scope definition
        let key = '';
        const singleAudience = !this.areScopesProvided() || this.isSingleAudience();

        // determine a key based on the type of configuration we are using.
        // multiple audience means we are just receiving scopes
        // from multiple audiences, so instead of getting them
        // when we get the id token, we get them as needed
        if (singleAudience) {
          key = this.config.audience;
        } else if (url !== undefined && typeof this.callbacks.GetScopesKeyFromUrl === 'function') {
          key = this.callbacks.GetScopesKeyFromUrl(url);
        }

        // if we do not get a key, we have an error state.
        if (key === undefined || key === null || key === '') {
          if (typeof this.callbacks.onRenewError === 'function') {
            this.callbacks.onRenewError('Audience String Is Missing');
          }
          resolve();
        } else {
          // let's attempt to get the token from cache... if we can, and it's not expired, just use it
          const item = this.tokenManager.get(key, this.config.accessTokenThreshold);

          // if we have a token, use it
          if (item !== undefined) {
            resolve(item.value);

            // if this is single audience, we can just call renewIdToken again with a callback
          } else if (singleAudience) {
            // get the access token here.
            // renew the id and access tokens here
            this.renewIdToken({ resolve: () => resolve(this.storage.info.accessToken), reject: () => resolve() });

            // if this is multiple audience, we need to find out which audience we would like to retrieve now.
          } else {
            // find the scopes for the given key from the array of scope definitions
            const scopeArray = this.config.scopes as GafAuth0SettingsAudienceScope[];
            const scopeItem = scopeArray.find((find: GafAuth0SettingsAudienceScope) => {
              return find.key === key;
            });

            // if we did not find any, then we have an error
            if (scopeItem === undefined) {
              if (typeof this.callbacks.onRenewError === 'function') {
                this.callbacks.onRenewError(`Could not find scopes for key: ${key}`);
              }

              // call checksession to get the scopes for the key.
            } else {
              this._auth0WebAuth.checkSession(
                { scope: 'token ' + scopeItem.scopes.join(' '), audience: scopeItem.audience },
                (err: any, result: any) => {
                  if (err) {
                    // we had an error getting the scopes
                    if (typeof this.callbacks.onRenewError === 'function') {
                      this.callbacks.onRenewError(err);
                    }
                    resolve();
                  } else {
                    // set the scope in the cache for future use
                    this.tokenManager.set(key, result.accessToken);
                    resolve(result.accessToken);
                  }
                },
              );
            }
          }
        }
      });
    });
    return promise;
  }

  /**
   * For parent mode, we need to parse the hash after callback
   */
  public handleAuthentication(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this._auth0WebAuth.parseHash((err, authResult) => {
        const promise = {
          resolve: () => {
            if (authResult && authResult.accessToken && authResult.idToken) {
              this.windowLocation.hash = '';

              this.setAuthSession(authResult);

              if (typeof this.callbacks.onAuthenticationChanged === 'function') {
                this.callbacks.onAuthenticationChanged(true);
              }
              resolve(true);
            } else if ((authResult === undefined || authResult === null) && (err === undefined || err === null)) {
              resolve(true); // no hash
            } else {
              reject(false);
            }
          },
          reject: () => {
            reject(err);
          },
        };

        this.checkSessionCallback(err, authResult, promise);
      });
    });
  }
  //#endregion
}
