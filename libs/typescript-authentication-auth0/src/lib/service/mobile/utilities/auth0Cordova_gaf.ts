import parse from 'url-parse';
import auth0 from 'auth0-js';
import getAgent from '@auth0/cordova/src/agent';
import * as crypto from './crypto';
import session from '@auth0/cordova/src/session';
import getOSRoot from '@auth0/cordova/src/utils';
import { raw as version } from '@auth0/cordova/src/version';
// const version = versionRoot.raw;
const closingDelayMs = 1000;

export class GafAuth0Cordova {
  clientId: string;
  domain: string;
  redirectUri: string;
  auth0: auth0.WebAuth;
  client: auth0.Authentication;
  version: any = version;
  telemetry = {
    version: version,
    name: 'auth0-cordova',
    lib_version: auth0.version
  };
  /**
   * Handler that must be called with the redirect url the browser tries to open after the OAuth flow is done.
   * To listen to that event, using cordova-plugin-customurlscheme, you need to register a callback in the method `window.handleOpenURL`
   * ```
   * var Auth0Cordova = require('@auth0/cordova');
   * window.handleOpenURL = Auth0Cordova.onRedirectUri(url);
   * ```
   *
   * @method onRedirectUri
   * @param url with a custom scheme relied to the application
   */
  static onRedirectUri(url: string) {
    // If we are running in UIWebView we need to wait
    const windowAny = (window as any);

    if (windowAny.webkit && windowAny.webkit.messageHandlers) {
      return session.onRedirectUri(url);
    }

    return setTimeout(() => {
      session.onRedirectUri(url);
    }, 4);
  }

  /**
   * Creates a new Cordova client to handle AuthN/AuthZ with OAuth and OS browser.
   * @param options
   * @param options.domain your Auth0 domain
   * @param options.clientId your Auth0 client identifier obtained when creating the client in the Auth0 Dashboard
   * @see {@link https://auth0.com/docs/api/authentication}
   */
  constructor(options: any) {
    session.clean();

    this.clientId = options.clientId;
    this.domain = options.domain;
    this.redirectUri = options.packageIdentifier + '://' + options.domain + '/cordova/' + options.packageIdentifier + '/callback';

    this.auth0 = new auth0.WebAuth({
      clientID: this.clientId,
      domain: this.domain
    });
    this.client = new auth0.Authentication(this.auth0, {
      clientID: this.clientId,
      domain: this.domain,
      _telemetryInfo: this.telemetry
    });
  }


  /**
   * @callback authorizeCallback
   * @param  [err] error returned by Auth0 with the reason of the Auth failure
   * @param  [result] result of the Auth request
   * @param  [result.accessToken] token that allows access to the specified resource server
   * (identified by the audience parameter or by default Auth0's /userinfo endpoint)
   * @param  [result.expiresIn] number of seconds until the access token expires
   * @param  [result.idToken] token that identifies the user
   * @param  [result.refreshToken] token that can be used to get new access tokens from Auth0.
   * Note that not all clients can request them or the resource server might not allow them.
   */

  /**
   * Opens the OS browser and redirects to `{domain}/authorize` url in order to initialize a new authN/authZ transaction
   *
   * @method authorize
   * @param  parameters
   * @param  [parameters.state] value used to mitigate XSRF attacks. {@link https://auth0.com/docs/protocols/oauth2/oauth-state}
   * @param  [parameters.nonce] value used to mitigate replay attacks when using Implicit Grant.
   * {@link https://auth0.com/docs/api-auth/tutorials/nonce}
   * @param  [parameters.scope] scopes to be requested during Auth. e.g. `openid email`
   * @param  [parameters.audience] identifier of the resource server who will consume the access token issued after Auth
   * @param  callback
   * @see {@link https://auth0.com/docs/api/authentication#authorize-client}
   * @see {@link https://auth0.com/docs/api/authentication#social}
   */
  authorize(parameters, callback) {
    // clear the keys
    const keys = crypto.generateProofKey();

    if (!callback || typeof callback !== 'function') {
      throw new Error('callback not specified or is not a function');
    }

    getAgent((err, agent) => {
      const client = this.client;
      const redirectUri = this.redirectUri;
      const requestState = parameters.state || crypto.generateState();

      parameters.state = requestState;

      const params = Object.assign({}, parameters, {
        code_challenge_method: 'S256',
        responseType: 'code',
        redirectUri: redirectUri,
        code_challenge: keys.codeChallenge
      });

      const url = client.buildAuthorizeUrl(params);

      agent.open(url, (error, result) => {
        if (error != null) {
          session.clean();
          return callback(error);
        }

        if (result.event === 'closed') {
          const handleClose = () => {
            if (session.isClosing) {
              session.clean();
              return callback(new Error('user canceled'));
            }
          };

          session.closing();
          if (getOSRoot.getOS() === 'ios') {
            handleClose();
          } else {
            setTimeout(handleClose, closingDelayMs);
            return;
          }
        }

        if (result.event !== 'loaded') {
          // Ignore any other events.
          return;
        }

        session.start((sessionError: any, redirectUrl: string) => {
          if (sessionError != null) {
            callback(sessionError);
            return true;
          }

          if (redirectUrl.indexOf(redirectUri) === -1) {
            return false;
          }

          if (!redirectUrl || typeof redirectUrl !== 'string') {
            callback(new Error('url must be a string'));
            return true;
          }

          const response = parse(redirectUrl, true).query;
          if (response.error) {
            callback(new Error(response.error_description || response.error));
            return true;
          }

          const responseState = response.state;
          if (responseState !== requestState) {
            callback(new Error('Response state does not match expected state'));
            return true;
          }

          const code = response.code;

          agent.close();
          client.oauthToken({
            code_verifier: keys.codeVerifier,
            grantType: 'authorization_code',
            redirectUri: redirectUri,
            code: code
          }, (exchangeError, exchangeResult) => {
            if (exchangeError) {
              return callback(exchangeError);
            }

            return callback(null, exchangeResult);
          });

          return true;
        });
      });
    });
  }

  /**
   * Logout from the auth0 session
   * @param callback Callback function to fire after logout
   */
  logout(callback) {
    if (!callback || typeof callback !== 'function') {
      throw new Error('callback not specified or is not a function');
    }

    getAgent((err, agent) => {
      const client = this.client;
      const url = this.client.buildLogoutUrl({clientiD: this.clientId});

      agent.open(url, (error, result) => {
        if (error !== undefined && error !== null) {
          session.clean();
          return callback(error);
        }

        if (result.event === 'closed') {
          const handleClose = () => {
            if (session.isClosing) {
              session.clean();
              return callback(new Error('user canceled'));
            }
          };

          session.closing();
          if (getOSRoot.getOS() === 'ios') {
            handleClose();
          } else {
            setTimeout(handleClose, closingDelayMs);
            return;
          }
        }

        if (result.event !== 'loaded') {
          // Ignore any other events.
          agent.close();
          callback();
          return;
        }
      });
    });
  }
}
