// angular and 3rd party imports
import * as auth0Library from 'auth0-js';

// gaf libraries
import { GafTokenManager, GafStorageManager } from '@gaf/typescript-authentication-general';
import { GafJwtHelper } from '@gaf/typescript-jwt';

// custom code
import { GafAuth0Setup } from '../../helpers/gaf-auth0-setup';
import { GafAuth0MobileSettings } from '../../config/gaf-auth0-settings';
import { GafAuth0Callbacks } from '../../config/gaf-auth0-callbacks';
import { WindowLocation } from '../../helpers/window-location';
import { GafAuth0 } from '../gaf-auth0.abstract';
import { GafAuth0Cordova as Auth0Cordova } from './auth0Cordova_gaf';
import { IGafPromiseFunctions } from '../../models/IGafPromiseFunctions';

export class GafAuth0Mobile extends GafAuth0 {
  //#region configure auth0 WebAuth
  client: Auth0Cordova;

  //#endregion
  constructor(
    public config: GafAuth0MobileSettings,
    public callbacks: GafAuth0Callbacks,
    protected tokenManager: GafTokenManager,
    public storage: GafStorageManager,
    protected windowLocation: WindowLocation,
  ) {
    super(config, callbacks, tokenManager, storage, windowLocation);


    // confirm that mobile only has single audience, single scope

    // now setup cordova configuration
    const cordovaConfig: any = {
      clientId: this.config.clientId,
      domain: this.config.domain,
      callbackUrl: this.windowLocation.href,
      packageIdentifier: this.config.packageIdentifier
    };
    this.client = new Auth0Cordova(cordovaConfig);
  }

  //#region private methods
  private setAuthSessionTokens(idToken: string, accessToken: string): void {
    this.storage.info.accessToken = accessToken;
    this.storage.info.idToken = idToken;
    this.scheduleRenewal();
  }
  //#endregion

  //#region Public Interface
  public login(): void {
    const scopeResultType = this._setup.getScopesAndResponseType(this.config, this.isSingleAudience());

    // get options
    const options = {
      scope: scopeResultType.scope,
      audience: this.config.audience
    };

    // configure auth0
    const auth0 = new auth0Library.WebAuth({
      clientID: this.config.clientId,
      domain: this.config.domain,
      callbackURL: location.href,
      packageIdentifier: this.config.packageIdentifier
    });

    this.client.authorize(options, (err, authResult) => {
      if (err) {
        throw err;
      }

      auth0Library.client.userInfo(authResult.accessToken, (err2, user) => {
        if (err2) {
          throw err2;
        }

        // place email on the object so it can be set in session
        authResult.email = user.email;

        this.setAuthSession(authResult);

        // TODO: now that we are successful, we can call the success path
      });
    });
  }

  /**
   * Logout and issue logout command
   */
  public logout(): void {
    if (typeof this.callbacks.onAuthenticationChanged === 'function') {
      this.callbacks.onAuthenticationChanged(false);
    }

    this.tokenManager.removeAll();
    this.clearSessionInfo();
    this._initialRenewIdTokenPromise = undefined;

    this.client.logout((err) => {
      if (err !== undefined && err !== null) {
        throw new Error(err);
      }
    });
  }

  public handleAuthentication(): Promise<boolean> {
    // no op for mobile, implemented for desktop
    return new Promise<boolean>((resolve) => {
      resolve(true);
    });
  }

  public renewIdToken(promise?: IGafPromiseFunctions): void {
    const promiseNew = this.getStandardPromiseFunction(promise);

    const scopeResultType = this._setup.getScopesAndResponseType(this.config, this.isSingleAudience());

    // get options
    const options = {
      scope: scopeResultType.scope,
      audience: this.config.audience
    };

    // configure auth0
    const auth0 = new auth0Library.WebAuth({
      clientID: this.config.clientId,
      domain: this.config.domain,
      callbackURL: location.href,
      packageIdentifier: this.config.packageIdentifier
    });

    let authClient: any;

    try {
      authClient = new auth0Library.Authentication(auth0, {
        clientID: this.config.clientId,
        domain: this.config.domain
      });

      const oauthTokenOptions = {
        refreshToken: this.storage.info.refreshToken,
        grantType: 'refresh_token',
        audience: this.config.audience,
        scopes: scopeResultType
      };

      authClient.oauthToken(oauthTokenOptions, (err, result) => {
        if (err) {
          if (typeof this.callbacks.onRenewError === 'function') {
            this.callbacks.onRenewError(err);
          }
          promiseNew.resolve(false);
        } else if (result.error) {
          if (typeof this.callbacks.onRenewError === 'function') {
            this.callbacks.onRenewError(result.error);
          }
          promiseNew.resolve(false);
        } else {
          this.setAuthSessionTokens(result.idToken, result.accessToken);
          promiseNew.resolve(true);
        }
      });

    } catch (ex) {
      if (typeof this.callbacks.onRenewError === 'function') {
        this.callbacks.onRenewError(ex);
      }
      promiseNew.resolve(false);
    }
  }
  //#endregion
}
