import { GafAuth0Browser } from './gaf-auth0-browser';
import { GafAuth0Settings, GafAuth0SettingsAudienceScope } from '../../config/gaf-auth0-settings';
import {
  GafTokenManager,
  GafStorageManagerSession,
  GafStorageManagerMemory,
  GafAuthenticationMode,
} from '@gaf/typescript-authentication-general';
import { GafAuth0Callbacks } from '../../config/gaf-auth0-callbacks';
import { WindowLocationMock } from '../../mocks/window-location-mock';
import { GafStorageManagerMock } from '../../mocks/gaf-storage-manager-mock';
import { IGafPromiseFunctions } from '../../models/IGafPromiseFunctions';

const jwtToken =
  'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJpc3MiOiJodHRwczovL2p3dC1pZHAuZXhhbXBsZS5jb20iLCJzdWIiOiJtYWlsdG86bWlrZUBleGFtcGxlLmNvbSIsIm5iZiI6MTU0OTA1NzA3MywiZXhwIjoxNTgwNTkzMDczLCJpYXQiOjE1NDkwNTcwNzMsImp0aSI6ImlkMTIzNDU2IiwidHlwIjoiaHR0cHM6Ly9leGFtcGxlLmNvbS9yZWdpc3RlciJ9.'; //tslint:disable-line
const config: GafAuth0Settings = {
  clientId: '',
  domain: '',
  audience: 'audience',
  authorize: {},
  scopes: ['test', 'scope'],
  loginUri: 'http://test.com',
  logoutUri: 'http://test.com',
};
const callbacks: GafAuth0Callbacks = {
  onAuthenticationChanged: (success: boolean) => {},
};

const startingPathname = '/test/route';
const startingUri = `http://return.test.com${startingPathname}`;
let windowLocation: WindowLocationMock;
let tokenManager: GafTokenManager;

const createModule = () => {
  const storageSession = new GafStorageManagerMock();
  tokenManager = new GafTokenManager();
  windowLocation = new WindowLocationMock();
  windowLocation.href = startingUri;
  const service = new GafAuth0Browser(
    JSON.parse(JSON.stringify(config)),
    callbacks,
    tokenManager,
    storageSession,
    windowLocation,
  );
  return service;
};

const createModuleMemory = () => {
  const storageMemory = new GafStorageManagerMemory();
  tokenManager = new GafTokenManager();
  windowLocation = new WindowLocationMock();
  windowLocation.href = startingUri;
  const service = new GafAuth0Browser(
    JSON.parse(JSON.stringify(config)),
    callbacks,
    tokenManager,
    storageMemory,
    windowLocation,
  );
  return service;
};

const runGetAccessToken = (service: GafAuth0Browser, done?: any, token?: string, error = false) => {
  const result = {
    accessToken: jwtToken,
    idToken: jwtToken,
    idTokenPayload: {
      email: 'a@b.com',
    },
  };

  spyOn<any>(service['_auth0WebAuth'], 'checkSession').and.callFake((obj: any, fn: (err: any, result: any) => void) => {
    if (error) {
      fn({ error: 'error' }, null);
    } else {
      fn(null, result);
    }
  });

  const timeoutSpy = spyOn<any>(window, 'setTimeout').and.callFake((fn: () => void, timeout: number) => {
    // do nothing.. no need to renew again
  });

  service.start();
  const promise = service.getAccessToken('http://test.com');

  promise.then(data => {
    if (token) {
      expect(data).toBe(token);
    } else {
      expect(data).toBeUndefined();
    }
    if (done) {
      done();
    }
  });
};

describe('GafAuth0BrowserService single audience tokens exist already', () => {
  let service: GafAuth0Browser;
  beforeEach(() => {
    // create the module
    service = createModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set single audience token into cache', () => {
    service.start();
    const token = tokenManager.get('audience');
    expect(token).toBeDefined();
  });

  it('test login parent mode', () => {
    service.start();
    const spy = spyOn<any>(service['_auth0WebAuth'], 'authorize').and.callFake(() => {});
    service.config.mode = GafAuthenticationMode.Parent;
    service.login();

    expect(spy).toHaveBeenCalled();
  });

  it('test login child mode', () => {
    service.start();

    const spy = spyOn<any>(windowLocation, 'assign').and.callFake(() => {});
    service.config.mode = GafAuthenticationMode.Child;
    service.login();

    expect(spy).toHaveBeenCalled();
  });

  it('test logout parent mode', () => {
    service.start();
    const spy = spyOn<any>(service['_auth0WebAuth'], 'logout').and.callFake(() => {});
    service.config.mode = GafAuthenticationMode.Parent;
    service.logout();

    expect(spy).toHaveBeenCalled();
  });

  it('test login child mode', () => {
    service.start();

    windowLocation.assign = jasmine.createSpy('windowLocation.assign', windowLocation.assign);
    service.login();
    expect(windowLocation.assign).toHaveBeenCalled();
  });

  it('test login child mode with no redirect', () => {
    service.start();

    windowLocation.assign = jasmine.createSpy('windowLocation.assign', windowLocation.assign);

    service.config.loginUri = undefined;

    service.login();
    expect(windowLocation.assign).toHaveBeenCalledTimes(0);
  });

  it('test logout child mode', () => {
    service.start();

    spyOn<GafAuth0Callbacks>(service.callbacks, 'onAuthenticationChanged').and.callFake((success: boolean) => {
      expect(success).toBeFalsy();
    });

    service.logout();
  });

  it('Get Access Token', (done: any) => {
    service.start();
    const promise = service.getAccessToken('http://test.com');
    promise.then(data => {
      expect(data).toBeDefined();
      done();
    });
  });

  it('Get Access Token without audience', (done: any) => {
    service.start();
    const promise = service.getAccessToken('http://test.com');

    service.config.audience = undefined;

    promise.then(data => {
      expect(data).toBeUndefined();
      done();
    });
  });

  it('should get email a@b.com', () => {
    service.start();
    expect(service.getEmail()).toBe('a@b.com');
  });

  it('should handle successful authentication', (done: any) => {
    service.start();

    const timeoutSpy = spyOn<any>(window, 'setTimeout');
    const spy = spyOn<any>(service['_auth0WebAuth'], 'parseHash').and.callFake(fn => {
      const result = {
        accessToken: 'accessToken',
        idToken: 'idToken',
        idTokenPayload: {
          email: 'a@b.com',
        },
      };
      fn(null, result);
    });

    service.handleAuthentication().then(result => {
      expect(result).toBeTruthy();
      done();
    });
  });

  it('should handle successful authentication but no auth result returned', (done: any) => {
    service.start();

    const timeoutSpy = spyOn<any>(window, 'setTimeout');

    const spy = spyOn<any>(service['_auth0WebAuth'], 'parseHash').and.callFake(fn => {
      fn(null, undefined);
    });

    service.handleAuthentication().then(result => {
      expect(result).toBeTruthy();
      done();
    });
  });

  it('should handle failed authentication', (done: any) => {
    service.start();

    const timeoutSpy = spyOn<any>(window, 'setTimeout');

    const spy = spyOn<any>(service['_auth0WebAuth'], 'parseHash').and.callFake(fn => {
      fn(new Error('test'), undefined);
    });

    service.handleAuthentication().then(
      result => {},
      err => {
        expect(err).toBeDefined();
        done();
      },
    );
  });

  it('should handle failed authentication because authResult does not have token', (done: any) => {
    service.start();

    const timeoutSpy = spyOn<any>(window, 'setTimeout');

    const spy = spyOn<any>(service['_auth0WebAuth'], 'parseHash').and.callFake(fn => {
      fn(null, {});
    });

    service.handleAuthentication().then(
      result => {},
      err => {
        expect(err).toBeDefined();
        done();
      },
    );
  });

  it('should renew token because it is expired', done => {
    service.config.accessTokenThreshold = 50000000000; // big value to cause token to expire
    runGetAccessToken(service, done, service.storage.info.accessToken);
  });
});

describe('GafAuth0BrowserService single audience no tokens', () => {
  let service: GafAuth0Browser;
  beforeEach(() => {
    // create the module
    service = createModuleMemory();
  });

  it('should set session info', () => {
    service.start();

    service['setAuthSession']({
      accessToken: jwtToken,
      idToken: jwtToken,
      idTokenPayload: {
        email: 'email',
        given_name: 'given',
        family_name: 'family',
        nickname: 'nickname',
        name: 'name',
      },
    });

    expect(service.storage.info.accessToken).toBe(jwtToken);
  });

  it('should get email and return empty string', () => {
    service.start();
    expect(service.getEmail()).toBe('');
  });

  it('Get Access Token', (done: any) => {
    const result = {
      accessToken: jwtToken,
      idToken: jwtToken,
      idTokenPayload: {
        email: 'a@b.com',
      },
    };

    spyOn<any>(service['_auth0WebAuth'], 'checkSession').and.callFake(
      (obj: any, fn: (err: any, result: any) => void) => {
        fn(null, result);
      },
    );

    const timeoutSpy = spyOn<any>(window, 'setTimeout').and.callFake((fn: () => void, timeout: number) => {
      // do nothing.. no need to renew again
    });

    service.start();
    const promise = service.getAccessToken('http://test.com');

    promise.then(data => {
      expect(data).toBe(jwtToken);
      done();
    });
  });
});

describe('GafAuth0BrowserService multiple audience existing tokens', () => {
  let service: GafAuth0Browser;
  beforeEach(() => {
    // create the module
    service = createModule();

    // add multiple scopes
    const scopes: GafAuth0SettingsAudienceScope[] = [];
    scopes.push({
      key: 'test1',
      audience: 'test1',
      scopes: ['test1_a', 'test1_b'],
    });
    scopes.push({
      key: 'test2',
      audience: 'test2',
      scopes: ['test2_a', 'test2_b'],
    });
    service.config.scopes = scopes;

    service.callbacks.GetScopesKeyFromUrl = (url: string) => {
      return 'test1';
    };
  });

  it('Get Access Token', (done: any) => {
    runGetAccessToken(service, done, jwtToken);
  });

  it('Get Access Token - error', (done: any) => {
    runGetAccessToken(service, undefined, undefined, true);
    service.callbacks.onRenewError = (error: any) => {
      done();
    };
  });

  it('Get Access Token - no key', (done: any) => {
    service.callbacks.GetScopesKeyFromUrl = (url: string) => undefined;
    service.callbacks.onRenewError = (error: any) => {
      done();
    };

    runGetAccessToken(service);
  });

  it('Get Access Token - key not found', (done: any) => {
    service.callbacks.GetScopesKeyFromUrl = (url: string) => 'notfound';
    service.callbacks.onRenewError = (error: any) => {
      done();
    };

    runGetAccessToken(service);
  });
});
