import { Injectable, Inject, Injector } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, empty, from } from 'rxjs';
import { catchError, mergeMap, map } from 'rxjs/operators';

// app specific imports
import { GafAuth0InterceptorSettings } from '../config/gaf-auth0-interceptor-settings';
import { GafAuth0Service } from '../service/gaf-auth0-service';


@Injectable({
  providedIn: 'root'
})
export class GafAuth0Interceptor implements HttpInterceptor {
  private _config: GafAuth0InterceptorSettings;
  private _authService: GafAuth0Service;
  private log;

  constructor(
    private injector: Injector,
    @Inject('GafAuth0InterceptorSettings') private config: GafAuth0InterceptorSettings
  ) {
    this.log = console;
    this._config = (this.config || new GafAuth0InterceptorSettings());
  }

  //#region Private Methods
  /**
   * Get a reference to the auth service
   */
  private get authService() {
    if (this._authService === undefined) {
      this._authService = this.injector.get(GafAuth0Service); // tslint:disable-line
    }
    return this._authService;
  }

  /**
   * Determine the host name
   */
  private getHost(url: string): string {
    const urlParts = url.replace('http://', '').replace('https://', '').split(/[/?#]/);
    return urlParts[0];
  }
  //#endregion

  //#region Interface implementation
  handleInterception(
    token: string,
    request: HttpRequest<any>,
    next: HttpHandler): { request: HttpRequest<any>, httpEvent: Observable<HttpEvent<any>> } {

    // if there is no token then we need to return no request
    if (!token) {
      // this.log.error(new AccessTokenError());

      return {
        request: null,
        httpEvent: empty()
      };
    }

    // check if the request is within the list of whitelisted domains and is not unsecured.
    // these are the only domains that all allowed security
    if (this.isWhitelistedDomain(request) && !this.config.IsUnsecureResource(request)) {
      // add custom headers to the request which are application specific
      let headers = this.config.AddCustomHeaders(request, this.authService);

      // if there are no headers added, then create an empty object
      if (headers === undefined || headers === null) {
        headers = {};
      }

      // authorization header
      headers[this._config.headers.Authorization] = `${this._config.authScheme}${token}`;

      // clone this request with the new headers
      request = request.clone({
        setHeaders: headers
      });
    }

    return {
      request: request,
      httpEvent: next.handle(request)
    };
  }

  /**
   *
   * @param err The error from httpresponse
   * @param log a log object to log the error
   * @param req the request
   * @param isLogging is this the logging endpoint itself. If so, don't attempt to log an error logging
   */
  handleError(err: HttpErrorResponse, log: any, req: HttpRequest<any>, isLogging: boolean) {
    // if this is the logging endpoint, we can't log the error
    if (isLogging) {
      // we can't use global error handling here
      console.error(err);
      return empty();
    }

    // if the logging service is available, let's log with it
    if (log !== undefined && log !== null) {
      // enumerate headers
      const headers = {};
      req.headers.keys().forEach((key) => {
        headers[key] = req.headers.get(key);
      });

      const errorResult = {
        error: err,
        request: {
          method: req.method,
          url: req.urlWithParams,
          headers: headers,
          body: req.serializeBody(),
          params: req.params
        }
      };

      log.error(errorResult);
    }

    // throw the error
    throw err; // new AuthInterceptorError(err);
  }

  private interceptHandleToken(interceptInfo:
    { request: HttpRequest<any>, httpEvent: Observable<HttpEvent<any>> }): Observable<HttpEvent<any>> {
    return interceptInfo.httpEvent.pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          console.log('event--->>>', event);
        }

        return event;
      }),
      catchError(err =>
        this.handleError(
          err,
          this.log,
          interceptInfo.request,
          this.config.IsLoggingResource(interceptInfo.request.url)
        )
      )
      // ,
      // catchError(err => this.handleError(err, this.log, interceptInfo.request, this.config.IsLoggingResource(request.url)))
    );
  }

  /**
   * The interception is done here.
   * @param req The request
   * @param next The next handler
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this._config.IsStaticResource(request) && !this._config.IsUnsecureResource(request)) {
      const tokenGetterResult = this._config.TokenGetter(request, this.authService);

      if (tokenGetterResult instanceof Promise) {
        // token from promise
        return from(tokenGetterResult).pipe(
          mergeMap((token: string) => {
            const interceptInfo = this.handleInterception(token, request, next);
            return this.interceptHandleToken(interceptInfo);
          })
        );
      } else {
        // token from string
        const interceptInfo = this.handleInterception(<string>tokenGetterResult, request, next);
        return this.interceptHandleToken(interceptInfo);
      }
    } else {
      // static and/or unsecure
      return next.handle(request).pipe(
        map((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            console.log('event--->>>', event);
          }
          return event;
        }));
    }
  }

  /**
   * Check to see if this is within the whitelisted
   * @param request The request
   */
  isWhitelistedDomain(request: HttpRequest<any>): boolean {
    const authService = this.authService;

    // get the host from the url
    const host = this.getHost(request.url);

    // get the list of whitelisted domains
    const domains = authService ? authService.config.whitelistDomains : undefined;

    // if there are no domains, then all domains are ok
    if (domains === undefined || domains === null || domains.length === 0) {
      return true;
    }

    // check to see if this is within the list of whitelisted domains which can be string or RegExp
    return (domains.findIndex((item) => {
      if (typeof item === 'string') {
        return item.toLowerCase() === host.toLowerCase();
      }

      if (item instanceof RegExp) {
        return item.test(host);
      }

      return false;
    }) > -1);
  }
}
