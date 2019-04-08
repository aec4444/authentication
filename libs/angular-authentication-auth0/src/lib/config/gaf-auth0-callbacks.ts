import { Injector } from '@angular/core';

export interface GafAuth0Callbacks {
    HandleAuthenticationSuccess?(injector: Injector): void;
    HandleAuthenticationFailure?(injector: Injector): void;
    GetScopesKeyFromUrl?(url: string): string;
}

