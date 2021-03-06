# @gaf/typescript-authentication-auth0

This integrates Auth0 with your application.  This library is in typescript.  It can be used as a base for Angular services or used by itself

## Adding Module to your project

To acquire the module from NPM, use the following command:

``` shell
npm install --save @gaf/typescript-authentication-auth0
```

To create the browser based auth0 object, use the code below.  When using Angular, you can consider using Dependency Injection to get services that extend the interfaces of these objects.

The configuration and callback methods will be explained further later in this document.

```javascript
  const config: GafAuth0Settings = {
    clientId: '', // client ID from auth0
    domain: '', // domain of your auth0 server
    audience: 'audience', // the audence you are going to use
    scopes: ['test', 'scope'], // scopes to add to your token
    loginUri: 'http://test.com', // login URI
    logoutUri: 'http://test.com' // logout URI
  };

  const callbacks: GafAuth0Callbacks = {
    onAuthenticationChanged: (success: boolean) => {};
    getScopesKeyFromUrl: (url: string) => 'key';
    onRenewError: (error: any) => {};
  };

  // instantiate a storage manager
  const storageSession = new GafStorageManagerSession();

  // create a token manager
  const tokenManager = new GafTokenManager();

  const service = new GafAuth0Browser(
    config
    callbacks,
    tokenManager,
    storageSession,
  );
```

## Configuration

This Module supports 2 different modes for Browser based (non-mobile) authentication:  Child and Parent.  
**Child Mode** - A different application calls your application.  You rely on SSO Cookie to drive authentication.  If your application cannot acquire an access token, you will be redirected back to the parent application.

**Parent Mode** - Your application drives all authentication.  If the user is not logged in or cannot get a token, you will be sent to the hosted login page.

### Parent Mode

Parent mode is when your application drives the authentication process.  It will interact with Auth0 and call the hosted login page (through auth0.authorize) when necessary.

#### 1 Audience

Below is a sample code block for configuration for a simple implementation that includes a few scopes in parent mode.  This simple configuration will set up 1 audience with a list of scopes.  The module will handle all of the integration with Auth0 for authentication and acquiring an access token for the audience/scopes.

``` javascript
export const AUTH0_CONFIG: GafAuth0Settings = {
  clientId: '<<Auth0 Client>>',
  domain: '<<Auth0 Domain>>',
  accessTokenThreshold: 15000,
  audience: '<<Auth0 API Audience Name>>',
  loginUri: '<<URL Within your application for login, http://localhost:4200>>',
  logoutUri: '<<URL registered to handle logouts, , http://localhost:4200',
  redirectUri: '<<URL Registered to handle the callback on login,  http://localhost:4200/callback>>',

  whitelistDomains: [
    '<<domain, including port if necessary>>',
    ...
  ],

  scopes: [
    '<<scope name>>',
    '<<scope name>>'
  ],

  mode: GafAuthenticationMode.Parent
};
```

#### Multiple Audiences

The API handles the ability to work with multiple access tokens for different audiences.  This defines each set of scopes.  Below is an example configuration for multiple audiences:

``` javascript
export const AUTH0_CONFIG: GafAuth0Settings = {
  clientId: '<<Auth0 Client>>',
  domain: '<<Auth0 Domain>>',
  accessTokenThreshold: 15000,
  audience: '<<Auth0 API Audience Name>>',
  loginUri: '<<URL Within your application for login, http://localhost:4200>>',
  logoutUri: '<<URL registered to handle logouts, , http://localhost:4200',
  redirectUri: '<<URL Registered to handle the callback on login,  http://localhost:4200/callback>>',

  whitelistDomains: [
    '<<domain, including port if necessary>>',
    '<<domain, including port if necessary>>',
    ...
  ],

  scopes: [
    { audience: '<<audience>>', scopes: <<Array of Scopes for this audience>>, key: '<<keyname for this set of scopes>>' },
    { audience: '<<audience>>', scopes: <<Array of Scopes for this audience>>, key: '<<keyname for this set of scopes>>'},
    ...
  ],
  mode: GafAuthenticationMode.Parent
};
```

### Child Mode

Child mode allows you to receive a SSO handoff from a parent application.  The module will request the tokens necessary leveraging the Auth0 Cookie that is stored for SSO.  If the access token cannot be acquired, instead of going directly to Auth0 Hosted Login page, it would return to the parent application.

You'll notice a lot of the configuration is the same.  The main differences are the loginUri and logoutUri.

``` javascript
export const AUTH0_CONFIG: GafAuth0Settings = {
  clientId: '<<Auth0 Client>>',
  domain: '<<Auth0 Domain>>',
  accessTokenThreshold: 15000,
  audience: '<<Auth0 API Audience Name>>',
  loginUri: '<<URL to the parent application handling logins>>',
  logoutUri: '<<URL to the parent application handling logouts>>',
  redirectUri: '<<URL Registered to handle the callback on login,  http://localhost:4200/callback>>',

  whitelistDomains: [
    '<<domain, including port if necessary>>',
    '<<domain, including port if necessary>>',
    ...
  ],

  scopes: [
    { audience: '<<audience>>', scopes: <<Array of Scopes for this audience>>, key: '<<keyname for this set of scopes>>' },
    { audience: '<<audience>>', scopes: <<Array of Scopes for this audience>>, key: '<<keyname for this set of scopes>>'},
    ...
  ],
  mode: GafAuthenticationMode.Child,
  setupRefreshTimer: true // default is true, if false, this will not set up timers for auto token refresh
};
```

## Auth0 Callback Methods

The module supports 5 optional callbacks that can be used to act on specific actions within the module.  These are not required.

Below are the definitions:

### handleAuthenticationSuccess(injector: Injector): void

This method will be called when login is successful.  This allows you to react to the successful login and perform actions (such as a redirect to the welcome page).

### handleAuthenticationFailure(injector: Injector): void

This method will be called when login is not successful.  It will allow you to redirect users to a not authorized page or any other action.

### getScopesKeyFromUrl?(url: string): string

This method is used for those configurations that have multiple sets of scopes configured.  If there is only 1 set of scopes (a string array in the configuration), then this method is not necessary.  It gives your application to determine the Scopes Key based on the URL called.  The key returned will be used to get the access token from the cache, and if it doesn't exist, request the access token from auth0.

### onAuthenticationChanged(success: boolean): void

This method is used whenever authentication changes.  It will allow you to respond to events based on authentication changes.

### onRenewError(err: any): void

This method is used whenever an error occurs when attempting to renew an token.
