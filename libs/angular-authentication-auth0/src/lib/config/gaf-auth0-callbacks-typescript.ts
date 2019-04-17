import { Injector } from '@angular/core';
import { GafAuth0Callbacks } from './gaf-auth0-callbacks';
import { GafAuth0Callbacks as TypescriptCallbacks } from '@gaf/typescript-authentication-auth0';

export function CreateGafAuth0CallbacksTypescript(
  callbacks: GafAuth0Callbacks,
  injector: Injector): TypescriptCallbacks {

  const result: TypescriptCallbacks = {};

  if (typeof callbacks.getScopesKeyFromUrl === 'function') {
    result.getScopesKeyFromUrl = (url: string) => callbacks.getScopesKeyFromUrl(url);
  }

  if (typeof callbacks.handleAuthenticationSuccess === 'function') {
    result.handleAuthenticationSuccess = () => callbacks.handleAuthenticationSuccess(injector);
  }

  if (typeof callbacks.handleAuthenticationFailure === 'function') {
    result.handleAuthenticationFailure = () => callbacks.handleAuthenticationFailure(injector);
  }
  return result;
}
