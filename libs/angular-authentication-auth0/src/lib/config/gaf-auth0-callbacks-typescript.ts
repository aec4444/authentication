import { Injector } from '@angular/core';
import { GafAuth0Callbacks } from './gaf-auth0-callbacks';
import { GafAuth0Callbacks as TypescriptCallbacks } from '@gaf/typescript-authentication-auth0';

export function CreateGafAuth0CallbacksTypescript(
  callbacks: GafAuth0Callbacks): TypescriptCallbacks {

  const result: TypescriptCallbacks = {};

  if (typeof callbacks.GetScopesKeyFromUrl === 'function') {
    result.GetScopesKeyFromUrl = (url: string) => callbacks.GetScopesKeyFromUrl(url);
  }

  return result;
}
