/*
 * Public API Surface of angular-authentication-auth0
 */

// service
export * from './lib/service/browser/gaf-auth0-browser.service';
export * from './lib/service/browser/gaf-auth0-browser.module';
export * from './lib/service/mobile/gaf-auth0-mobile.service';
export * from './lib/service/mobile/gaf-auth0-mobile.module';
export * from './lib/mock/gaf-auth0-mock.service';
export * from './lib/mock/gaf-auth0-mock.module';
export * from './lib/service/gaf-auth0-service';
export * from './lib/service/IGafAuth0Service';

// config
export * from './lib/config/gaf-auth0-callbacks';
export * from './lib/config/gaf-auth0-interceptor-settings';

// token manager
export * from './lib/token-manager/gaf-token-manager.service';

// storage
export * from './lib/storage/browser/gaf-auth0-browser-storage.service';
export * from './lib/storage/memory/gaf-auth0-memory-storage.service';

// interceptor
export * from './lib/interceptor/gaf-auth0.interceptor';

// callback
export * from './lib/callback/callback.component';

// route guards
export * from './lib/gaf-auth0-can-activate/gaf-auth0-can-activate.routeguard';
