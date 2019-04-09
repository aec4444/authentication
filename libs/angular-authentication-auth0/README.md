# Auth0 Integration

This integrates Auth0 with your application.  All that is needed is configuration, and you have a working Auth0 service.

## Adding Module to your project

To acquire the module from NPM, use the following command:

``` shell
npm install --save @gaf/angular-authentication-auth0
```

Add the following to your AppModule's imports.

``` javascript
import { GafAuth0BrowserModule } from '@gaf/angular-authentication-auth0';
```

``` javascript
GafAuth0BrowserModule.forRoot(AUTH0_CONFIG, customInterceptor, CustomAuth0Callbacks)
```

As you can see, this module leverages the forRoot pattern to pass 3 objects to the module. They are:

- Configuration (AUTH0_CONFIG)
- Custom Interceptor Methods
- Custom Auth0 Callback functions

Each of these will be discussed below.

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

#### CallbackComponent

When the module is configured for parent mode, it will drive the user to the hosted login page when login is requested.  Auth0 requires a callback to be configured that your application will handle.  This module has a CallbackComponent which can be used saving the developer time from having to implement this default implementation.  The CallbackComponent will receive the callback from Auth0 and will call HandleAuthenticationSuccess or HandleAuthenticationFailure from the Auth0 Callback Methods (see below about Auth0 Callback Methods).

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
  mode: GafAuthenticationMode.Child
};
```

## Custom Interceptor Configuration Methods

This module implements an interceptor to carry out actions when HttpRequests are made.  Primarily, it will acquire an access token and add it as an Authorization Bearer token to the request.  The default implementation is GafAuth0InterceptorSettings and will be used if no implementation is passed to forRoot.  Most developers will extend this class for the implementation within their application.

### TokenGetter(req: HttpRequest<any>, auth: GafAuth0Service): Promise<string> | string

This method is used to acquire an access token.  Most implementations do not override this method.

### IsStaticResource(req: HttpRequest<any>): boolean {

This method determines if a resource is static (image file, html or json).  If you wish to use a different implementation to determine this, you would override this method.  Static resources will not acquire an access token for the domain.

### IsUnsecureResource(req: HttpRequest<any>): boolean {

If you wish to access any resources that are not secure and therefore do not need an access token, you would use this logic to determine that.  The default implementation returns false for all domains.

### IsLoggingResource(url: string): boolean {

If the domain being accessed is for logging, this implementation would return true.  It's assumed for the sake of this module that logging is not secure, so this is similar to returning true from IsUnsecureResource.  

### AddCustomHeaders(req: HttpRequest<any>, authService: GafAuth0Service): { [name: string]: string | string[] } {

This is the most commonly extended method.  This will add custom headers to the request.   By default, this will add the ID Token to the request (in a header called Authorization2) and the User's email (in a header called User).  You can modify the names of these headers by modifying the headers map that is part of the default implementation.  If you wish to add additional headers, you can extend this method.

### Example Implementation

Below is an example implementation that adds a client_id and client_secret header to the request if the request starts with http://test.com.  This works well with multiple audiences in play.  For a single audience in play, you can skip the check against the req.url.

``` javascript
export class CustomInterceptorDefinition extends GafAuth0InterceptorSettings {
    AddCustomHeaders(req: HttpRequest<any>, authService: GafAuth0Service): {
        [name: string]: string | string[];
    } {
        const headers = super.AddCustomHeaders(req, authService);

        if (req.url.toLowerCase().startsWith('http://test.com')) {
            headers['client_id'] = 'client id';
            headers['client_secret'] = 'secret';
        }

        return headers;
    }
}
```

## Auth0 Callback Methods

The module supports 3 optional callbacks that can be used to act on specific actions within the module.  These are not required. 

Below are the definitions:

### HandleAuthenticationSuccess(injector: Injector): void

This method will be called when login is successful.  This allows you to react to the successful login and perform actions (such as a redirect to the welcome page).

### HandleAuthenticationFailure(injector: Injector): void;

This method will be called when login is not successful.  It will allow you to redirect users to a not authorized page or any other action.

### GetScopesKeyFromUrl?(url: string): string;

This method is used for those configurations that have multiple sets of scopes configured.  If there is only 1 set of scopes (a string array in the configuration), then this method is not necessary.  It gives your application to determine the Scopes Key based on the URL called.  The key returned will be used to get the access token from the cache, and if it doesn't exist, request the access token from auth0.

## Parent Mode Considerations

### CallbackComponent

When the module is configured for parent mode, it will drive the user to the hosted login page when login is requested.  Auth0 requires a callback to be configured that your application will handle.  This module has a CallbackComponent which can be used saving the developer time from having to implement this default implementation.  The CallbackComponent will receive the callback from Auth0 and will call HandleAuthenticationSuccess or HandleAuthenticationFailure from the Auth0 Callback Methods (see above).

## Child mode Considerations

### LoginUri and LogoutUri

These Uri
  loginUri: 'https://customerinventorydev.gaf.com',
  logoutUri: 'https://customerinventorydev.gaf.com',
