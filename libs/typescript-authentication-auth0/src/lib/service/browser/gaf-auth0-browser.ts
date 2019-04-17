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

  //#endregion
  constructor(
    public config: GafAuth0Settings,
    public callbacks: GafAuth0Callbacks,
    protected tokenManager: GafTokenManager,
    public storage: GafStorageManager,
    protected windowLocation: WindowLocation,
  ) {
    super(config, callbacks, tokenManager, storage, windowLocation);

    this._auth0WebAuth = this.createWebAuth();
    this._setup.configureEventListener();
  }

  //#region protected functions
  private createWebAuth(): auth0.WebAuth {
    return this._setup.createWebAuth(this.config, this.isSingleAudience());
  }

  /**
   * Renew the ID token
   * @param promise Promise resolve and reject functions to call
   */
  protected renewIdToken(promise?: IGafPromiseFunctions): void {
    const promiseNew = this.getStandardPromiseFunction(promise);

    this._auth0WebAuth.checkSession({}, (err: any, result: any) => this.checkSessionCallback(err, result, promiseNew));
  }
  //#endregion

  //#region Public Interface
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
   * Get Access Token for a given url
   * @param url The url we are attempting to get the access token for
   */
  public getAccessToken(url?: string): Promise<string> {
    const singleAudience = !this.areScopesProvided() || this.isSingleAudience();
    if (singleAudience) {
      return super.getAccessToken();
    } else {
      // multiple audience
      return new Promise<string>((resolve, reject) => {
        this._initialRenewIdTokenPromise.then(() => {
          const key = this.callbacks.getScopesKeyFromUrl(url);

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
    }
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
