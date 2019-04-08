// angular and 3rd party imports
import { HttpRequest } from '@angular/common/http';
import { GafAuth0Service } from '../service/gaf-auth0-service';

export class GafAuth0InterceptorSettings {
  authScheme = 'Bearer ';
  headers = {
    Authorization: 'Authorization',
    IdToken: 'Authorization2',
    clientId: 'client_id',
    clientSecret: 'client_secret',
    User: 'User'
  };

  /**
   * This gets an access token via promise and passes it along
   * This default implementation is probably good for most.
   * @param req The current request
   * @param auth A reference to the Auth Service
   */
  TokenGetter(req: HttpRequest<any>, auth: GafAuth0Service): Promise<string> | string {
    const url = req.url;
    const promise = auth.getAccessToken(url);

    return promise;
  }

  /**
   * Determines if this is a static resource.
   * This default implementation is probably good for most.
   * @param req The current request
   */
  IsStaticResource(req: HttpRequest<any>): boolean {
    const extensions = ['.html', '.json', '.js'];
    const url = req.url;

    for (let i = 0; i < extensions.length; i++) {
      const ext = extensions[i];
      if (url.substr(url.length - ext.length).toLowerCase() === ext) {
        return true;
      }
    }

    return false;
  }

  /**
   * Return true if this resource is unsecure
   * @param req the current request
   */
  IsUnsecureResource(req: HttpRequest<any>): boolean {
    return false; // by default all resources secure
  }

  /**
   * If this is a logging resource, it does not need security.  For secure logging, just set false
   * @param url the current request
   */
  IsLoggingResource(url: string): boolean {
    return false;
  }

  /**
   * This will get custom headers and add them to the request.
   * This default implementation is good for most, but you can extend this method
   * if more is needed.
   * @param req The current request
   * @param authService A reference to the auth service
   */
  AddCustomHeaders(
    req: HttpRequest<any>,
    authService: GafAuth0Service
  ): { [name: string]: string | string[] } {
    const headers = {};

    // if there is a request body, add this for application JSON
    if (req.body !== undefined && req.body !== null && req.body !== '') {
      if (headers['Content-Type'] === undefined) {
        headers['Content-Type'] = 'application/json';
      }
    }

    // get the id token so we can add it to the header for user validation

    const idToken =
      authService.storage.info === undefined
        ? ''
        : authService.storage.info.idToken;
    if (idToken !== undefined && idToken !== null && idToken !== '') {
      headers[this.headers.IdToken] = idToken;
    }

    const user =
      authService.storage.info === undefined ||
      authService.storage.info.profile === undefined
        ? ''
        : authService.storage.info.profile.email;
    if (user !== undefined && user !== null && user !== '') {
      headers[this.headers.User] = user;
    }
    return headers;
  }
}
