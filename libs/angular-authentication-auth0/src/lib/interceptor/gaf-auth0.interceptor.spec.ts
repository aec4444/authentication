import { TestBed, inject, async } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpRequest, HttpHandler, HttpErrorResponse, HttpHeaders, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Injector } from '@angular/core';

import { GafAuth0MockService } from '../mock/gaf-auth0-mock.service';
import { GafAuth0Callbacks } from '../config/gaf-auth0-callbacks';
import { GafAuth0Interceptor } from './gaf-auth0.interceptor';
import { GafTokenManagerService } from '../token-manager/gaf-token-manager.service';
import { GafAuth0InterceptorSettings } from '../config/gaf-auth0-interceptor-settings';
import { GafStorageManagerMockService } from '../mock/gaf-storage-manager-mock';
import { GafAuth0Service } from '../service/gaf-auth0-service';

// typecript lib
import { GafStorageManager } from '@gaf/typescript-authentication-general';
import { GafAuth0Settings, GafAuth0SettingsAudienceScope } from '@gaf/typescript-authentication-auth0';


class HttpRequestWithBodyMock extends HttpRequest<any> {
  set body(value) {

  }

  get body() {
    return {
      test: 123
    };
  }
}

describe('AuthInterceptor', () => {
  let httpMock: HttpTestingController;
  const config = new GafAuth0InterceptorSettings();
  let settings: GafAuth0Settings;
  const interceptorSettings = new GafAuth0InterceptorSettings();
  const callbacks: GafAuth0Callbacks = {};

  beforeEach(() => {
    const scopeAudience: GafAuth0SettingsAudienceScope = {
      audience: 'https://gafapidev.gaf.com/gafone/userprofilemanagement/api/v1',
      scopes: [
        'a',
        'b'
      ],
      key: 'test'
    };

    settings = {
      // client ID for auth 0 client
      clientId: '8mP1ENnrrJ2VqNA2qvtDCUabjYHt0iD8',

      // configuration for auth0
      domain: 'ssodev.gaf.com',
      redirectUri: 'http://local.gaf.com/callback',
      logoutUri: 'http://local.gaf.com',
      loginUri: 'http://local.gaf.com',
      audience: 'https://ssodev.gaf.com/userinfo',


      // url and scopes needed to get the rest of the scopes
      scopes: [scopeAudience],

      // refresh thresholds for tokens
      accessTokenThreshold: 2 * 60000,
      idTokenThreshold: 5 * 60000,

      // set of whitelist domains.  These domains will get access tokens for auth
      whitelistDomains: [
        undefined,
        new RegExp('\g'), // purposely here to test path of unit test
        'apigw.gaf.com',
        'waynewebdev3svc.gaf.com',
        'authinterceptor.com'
      ]
    };

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        { provide: GafAuth0Service, useClass: GafAuth0MockService },
        { provide: GafStorageManager, useClass: GafStorageManagerMockService},
        { provide: HTTP_INTERCEPTORS, useClass: GafAuth0Interceptor, multi: true },
        { provide: 'GafAuth0InterceptorSettings', useValue: interceptorSettings },
        GafTokenManagerService,
        { provide: 'GafAuth0Settings', useValue: settings },
        { provide: 'GafAuth0Callbacks', useValue: callbacks }
      ]
    });
    httpMock = TestBed.get(HttpTestingController);
  });

  it('config should get token from url', inject([GafAuth0Service], (service: GafAuth0Service) => {
    const req = new HttpRequest<any>('GET', 'http://authinterceptor.com/test1');
    const promise = config.TokenGetter(req, service);
    (<Promise<string>>promise).then((data) => {
      expect(data).toBe('test token');
    });
  }));

  it('config should determine static resource', inject([GafAuth0Service], (service: GafAuth0Service) => {
    let req = new HttpRequest<any>('GET', 'assets/file.json');
    let isStatic = config.IsStaticResource(req);
    expect(isStatic).toBeTruthy();
    req = new HttpRequest<any>('GET', 'http://authInterceptor/test1');
    isStatic = config.IsStaticResource(req);
    expect(isStatic).toBeFalsy();
  }));

  it('config should add custom headers', inject([GafAuth0Service], (service: GafAuth0Service) => {
    const req = new HttpRequestWithBodyMock('GET', 'http://authinterceptor.com/test1');
    const headers = config.AddCustomHeaders(req, service);

    expect(Object.keys(headers).length).toBeGreaterThan(0);
  }));

  it('should handle intercept', inject([HttpHandler, Injector],
    (httpHandler: HttpHandler, injector: Injector) => {
    const req = new HttpRequestWithBodyMock('GET', 'http://authInterceptor.com/test');
    const interceptor = new GafAuth0Interceptor(injector, config);
    const result = interceptor.intercept(req, httpHandler);

    result.subscribe(data => {
      expect(data).toBeDefined();
    });
  }));

  it('should test whitelisted domain', inject([HttpHandler, Injector],
    (httpHandler: HttpHandler, injector: Injector) => {
    let req = new HttpRequestWithBodyMock('GET', 'http://authInterceptor.com/test');
    const interceptor = new GafAuth0Interceptor(injector, config);
    expect(interceptor.isWhitelistedDomain(req)).toBeTruthy();

    req = new HttpRequestWithBodyMock('GET', 'http://authInterceptor2.com/test');
    expect(interceptor.isWhitelistedDomain(req)).toBeFalsy();
  }));

  it('should test whitelisted domain without domain list', inject([GafAuth0Service, HttpHandler, Injector],
    (authService: GafAuth0Service, httpHandler: HttpHandler, injector: Injector) => {
      const req = new HttpRequestWithBodyMock('GET', 'http://authInterceptor222.com/test');
      const interceptor = new GafAuth0Interceptor(injector, config);
      authService.config.whitelistDomains = undefined;
      expect(interceptor.isWhitelistedDomain(req)).toBeTruthy();
    }));

  it('should handle error response error object', inject([HttpHandler, Injector],
    (httpHandler: HttpHandler, injector: Injector) => {
    const interceptor = new GafAuth0Interceptor(injector, config);
    const headers = new HttpHeaders({
      test: 'test'
    });
    const req = new HttpRequestWithBodyMock('GET', 'http://authInterceptor.com/test', {},
      {
        headers: headers
      });

    const err = new HttpErrorResponse({ error: new Error('test') });
    try {
      interceptor.handleError(err, console, req, false);
    } catch (ex) {
      expect(ex).toBeDefined();
    }
  }));

  it('should handle error response if logging', inject([HttpHandler, Injector],
    (httpHandler: HttpHandler, injector: Injector) => {
    const interceptor = new GafAuth0Interceptor(injector, config);
    const err = new HttpErrorResponse({ error: new Error('test') });

    console.error = jasmine.createSpy('console.error');
    interceptor.handleError(err, console, null, true);
    expect(console.error).toHaveBeenCalledWith(err);
  }));

  it('should handle error response error code', inject([HttpHandler, Injector],
    (httpHandler: HttpHandler, injector: Injector) => {
    const interceptor = new GafAuth0Interceptor(injector, config);
    const err = new HttpErrorResponse({ error: 'Not found', status: 404 });
    try {
      interceptor.handleError(err, console, null, false);
    } catch (ex) {
      expect(ex).toBeDefined();
    }
  }));

  it('GafAuth0InterceptorSettings.isLoggingResource false',
    inject([HttpHandler, Injector], (httpHandler: HttpHandler, injector: Injector) => {
      const interceptor = new GafAuth0InterceptorSettings();
      expect(interceptor.IsLoggingResource('http://test.com')).toBeFalsy();
    }));

  it('should handleInterception handle no token', inject([HttpHandler, Injector],
    (httpHandler: HttpHandler, injector: Injector) => {
    const interceptor = new GafAuth0Interceptor(injector, config);
    try {
      interceptor.handleInterception(undefined, undefined, undefined);
    } catch (ex) {
      expect(ex).toBeDefined();
    }
  }));

  it('should handleInterception handle no token', inject([HttpHandler, Injector],
    (httpHandler: HttpHandler, injector: Injector) => {
    const interceptor = new GafAuth0Interceptor(injector, config);
    try {
      interceptor.handleInterception(undefined, undefined, undefined);
    } catch (ex) {
      expect(ex).toBeDefined();
    }
  }));

  it('should handleInterception return header object', inject([HttpHandler, Injector],
    (httpHandler: HttpHandler, injector: Injector) => {
    const req = new HttpRequestWithBodyMock('GET', 'http://authInterceptor.com/test');
    config.AddCustomHeaders = (request, auth) => {
      return undefined;
    };

    const interceptor = new GafAuth0Interceptor(injector, config);
    const item = interceptor.handleInterception('token', req, httpHandler);
    expect(item).toBeDefined();
  }));

  it('intercept static resource', async(() => {
    const http: HttpClient = TestBed.get(HttpClient);

    http.get('http://authInterceptor.com/test.json').subscribe(data => {
      expect(data).toBeDefined();
    });
    httpMock.expectOne('http://authInterceptor.com/test.json').flush({test: 1});
  }));

  it('should intercept with a string based token', async(() => {
    const http: HttpClient = TestBed.get(HttpClient);

    // simulate a string based token
    spyOn<GafAuth0InterceptorSettings>(interceptorSettings, 'TokenGetter').and.returnValue('testtoken');

    http.get('http://authInterceptor.com/test').subscribe(data => {
      expect(data).toBeDefined();
    });
    httpMock.expectOne('http://authInterceptor.com/test').flush({test: 1});
  }));

  it('should simulate http error', async(() => {
    const http: HttpClient = TestBed.get(HttpClient);

    // simulate a string based token
    spyOn<GafAuth0InterceptorSettings>(interceptorSettings, 'TokenGetter').and.returnValue('testtoken');

    http.get('http://authInterceptor.com/test').subscribe(data => {
    }, (err) => {
      expect(err).toBeDefined();
    });
    httpMock.expectOne('http://authInterceptor.com/test').error(new ErrorEvent('500'));
  }));

  afterEach(inject([HttpTestingController], (mock: HttpTestingController) => {
    mock.verify();
  }));
});
