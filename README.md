# gaf-authentication

This repository creates interfaces, typescript based implementations and an Angular library to integrate with Auth0 for Authentication.

Each library has its own README.md describing what it does.  Below is a high level description

## Libraries

All libraries reside in the `libs` folder of this monorepo.

### typescript-authentication-general

[README.md](libs/typescript-authentication-general/README.md)

This is a set of interfaces and base implementations to support authentication regardless of the provider.  

### typescript-authentication-auth0

[README.md](libs/typescript-authentication-auth0/README.md)

This is an implementation of Auth0 (<https://auth0.com/>) within Typescript.  By using generic typescript, the library is usable within any front end framework (Angular, React or others).

### angular-authentication-auth0

[README.md](libs/angular-authentication-auth0/README.md)

This is an Angular 7 implementation of Auth0.  It uses the typescript libraries created and bundles them in such a way to fit within the Angular ecosystem.

## Test Applications

The example applications reside in the `apps` folder.

### angular-authentication-auth0-test

This is a sample application to authenticate against Auth0 and call a REST API with an access token to acquire data.  Please note, the resources (Auth0 server and API) are private resources inside our network and cannot be called unless you are within GAF Network.

### react-authentication-auth0-test

This is the same example application created in React.
