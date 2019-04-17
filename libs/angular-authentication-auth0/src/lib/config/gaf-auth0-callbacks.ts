import { Injector } from '@angular/core';

export interface GafAuth0Callbacks {
    handleAuthenticationSuccess?(injector: Injector): void;
    handleAuthenticationFailure?(injector: Injector): void;
    getScopesKeyFromUrl?(url: string): string;
}

