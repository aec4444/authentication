import { Injector } from '@angular/core';
import { GafAuth0Callbacks } from './gaf-auth0-callbacks';
import { GafAuth0Callbacks as TypescriptCallbacks } from '@gaf/typescript-authentication-auth0';

export function CreateGafAuth0CallbacksTypescript(
  callbacks: GafAuth0Callbacks,
  injector: Injector): TypescriptCallbacks {

  const result: TypescriptCallbacks = {};

  if (typeof callbacks.HandleAuthenticationSuccess === 'function') {
    result.HandleAuthenticationSuccess = () => callbacks.HandleAuthenticationSuccess(injector);
  }

  if (typeof callbacks.HandleAuthenticationFailure === 'function') {
    result.HandleAuthenticationFailure = () => callbacks.HandleAuthenticationFailure(injector);
  }

  if (typeof callbacks.GetScopesKeyFromUrl === 'function') {
    result.GetScopesKeyFromUrl = (url: string) => callbacks.GetScopesKeyFromUrl(url);
  }

  return result;
}
