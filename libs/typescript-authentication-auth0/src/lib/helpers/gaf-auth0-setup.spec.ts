import { GafAuth0Setup } from './gaf-auth0-setup';
import { GafAuth0Settings } from '../config/gaf-auth0-settings';
import { WindowLocationMock } from '../mocks/window-location-mock';
import { WindowLocation } from './window-location';

describe('gaf-auth0-setup', () => {
  let setup: GafAuth0Setup;
  const config: GafAuth0Settings = {
    // client ID for auth 0 client
    clientId: '8mP1ENnrrJ2VqNA2qvtDCUabjYHt0iD8',

    // configuration for auth0
    domain: 'ssodev.gaf.com',
    redirectUri: 'http://localhost:4200/callback',
    logoutUri: 'http://localhost:4200',
    loginUri: 'http://localhost:4200',
    audience: 'https://ssodev.gaf.com/userinfo',

    // url and scopes needed to get the rest of the scopes
    scopes: [],

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

  let windowLocation: WindowLocation;
  beforeEach(() => {
    setup = new GafAuth0Setup();
    windowLocation = setup.windowLocation;
  });

  it('should get the origin with value', () => {
    // only work around for testing origin
    expect(setup.getOrigin()).toBe('http://localhost:9876');
  });

  it('should return webAuth', () => {
    const responseObj = setup.createWebAuth(config);
    const response = responseObj.baseOptions;
    expect(response.clientID).toBe(config.clientId);
    expect(response.domain).toBe(config.domain);
    expect(response.audience).toBe(config.audience);
    expect(response.redirectUri).toBe(config.redirectUri);
    expect(response.scope).toBe('openid profile email');
  });

  it('should return webAuth with authorize', () => {
    const newConfig = config;
    newConfig.authorize = {
      responseType: 'test',
      scopes: 'scope'
    };

    const responseObj = setup.createWebAuth(config);
    const response = responseObj.baseOptions;
    expect(response.clientID).toBe(config.clientId);
    expect(response.domain).toBe(config.domain);
    expect(response.audience).toBe(config.audience);
    expect(response.redirectUri).toBe(config.redirectUri);
    expect(response.scope).toBe('scope');
  });

  it('should return webAuth with empty authorize', () => {
    const newConfig = config;
    newConfig.authorize = {};

    const responseObj = setup.createWebAuth(newConfig);
    const response = responseObj.baseOptions;
    expect(response.clientID).toBe(config.clientId);
    expect(response.domain).toBe(config.domain);
    expect(response.audience).toBe(config.audience);
    expect(response.redirectUri).toBe(config.redirectUri);
    expect(response.scope).toBe('openid profile email');
  });

  it('should return webAuth with undefined config', () => {

    const responseObj = setup.createWebAuth(undefined);
    const response = responseObj.baseOptions;
    expect(response.clientID).toBe('');
    expect(response.domain).toBe('');
    expect(response.audience).toBe('');
    expect(response.redirectUri).toBe('');
    expect(response.scope).toBe('openid profile email');
  });

  it('can calculate origin', () => {
  })

  it('should setup event listener', (done: any) => {

    const spy = spyOn<any>(window, 'addEventListener').and.callFake((msg: string, fn: (event: any) => any) => {
      fn(window.location);
      done();
    });

    setup.configureEventListener();
  });

  it('should setup event listener with mismatched origin', (done: any) => {

    const spy = spyOn<any>(window, 'addEventListener').and.callFake((msg: string, fn: (event: any) => any) => {
      expect(fn({ origin: 'test'})).toBeNull();
      done();
    });

    setup.configureEventListener();
  });

  it('should test origin when it does not exist', (done) => {
    spyOnProperty<WindowLocation>(windowLocation, 'origin').and.returnValue(undefined);
    spyOnProperty<WindowLocation>(windowLocation, 'protocol').and.returnValue('http:');
    spyOnProperty<WindowLocation>(windowLocation, 'hostname').and.returnValue('test.com');
    spyOnProperty<WindowLocation>(windowLocation, 'port').and.returnValue(undefined);

    expect(setup.getOrigin()).toBe('http://test.com');
    done();
  });
});
