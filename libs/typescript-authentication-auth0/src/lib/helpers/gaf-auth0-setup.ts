import { GafAuth0Settings } from '../config/gaf-auth0-settings';
import * as auth0 from 'auth0-js';
import { WindowLocation } from './window-location';

export class GafAuth0Setup {
  constructor(public windowLocation?: WindowLocation) {
    if (this.windowLocation === undefined) {
      this.windowLocation = new WindowLocation();
    }
  }

  public createWebAuth(config: GafAuth0Settings, isSingleAudience = true): auth0.WebAuth {
    let scopes = 'openid profile email';
    let responseType = 'token id_token';

    if (config !== undefined && config.authorize !== undefined) {
      if (config.authorize.responseType !== undefined) {
        responseType = config.authorize.responseType;
      }

      if (isSingleAudience && config.authorize.scopes !== undefined) {
        scopes = config.authorize.scopes;
      }
    }

    if (isSingleAudience && config !== undefined && config.scopes !== undefined && config.scopes !== null && config.scopes.length > 0) {
      scopes = `${scopes} ${config.scopes.join(' ')}`;
    }

    return new auth0.WebAuth({
      clientID: config === undefined ? '' : config.clientId || '',
      domain: config === undefined ? '' : config.domain || '',
      audience: config === undefined ? '' : config.audience || '',
      redirectUri: config === undefined ? '' : config.redirectUri || '',
      responseType,
      scope: scopes,
    });
  }

  public configureEventListener(): void {
    window.addEventListener(
      'message',
      event => {
        const origin = this.getOrigin();
        if (event.origin !== origin) {
          return null;
        }
      },
      false,
    );
  }

  public getOrigin(): string {
    let origin = this.windowLocation.origin;
    if (!origin) {
      origin =
        this.windowLocation.protocol +
        '//' +
        this.windowLocation.hostname +
        (this.windowLocation.port ? ':' + this.windowLocation.port : '');
    }

    return origin;
  }
}
