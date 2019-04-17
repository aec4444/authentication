import { Injector, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { GafAuth0Callbacks, GafAuth0Service } from '@gaf/angular-authentication-auth0';
import { CUSTOMER_INVENTORY_SEARCH_CONFIG,
  GUARANTEE_REGISTRATION_CONFIG,
  ROOF_PROJECT_CONFIG } from '../../environments/environment';


export class CustomAuth0CallbacksDefinition implements GafAuth0Callbacks {
  getScopesKeyFromUrl(url: string): string {
    // based on the url, determine the key
    url = url.toLowerCase();

    if (url.indexOf(CUSTOMER_INVENTORY_SEARCH_CONFIG.baseUrl.toLowerCase()) >= 0) {
      return 'customerInventory';
    } else if (url.indexOf(GUARANTEE_REGISTRATION_CONFIG.baseUrl.toLowerCase()) >= 0) {
      return 'guaranteeRegistration';
    } else if (url.indexOf(ROOF_PROJECT_CONFIG.baseUrl.toLowerCase()) >= 0) {
      return 'roofProject';
    }

    return undefined;
  }

  handleAuthenticationSuccess?(injector: Injector): void {
    // get the router and send to the home page
    const router = injector.get<Router>(Router);
    router.navigateByUrl('');
  }

  handleAuthenticationFailure?(injector: Injector): void {
    // injector.get<GafAuth0Servive>(); doesn't work with abstract class as injectiontoken.
    const auth = <GafAuth0Service>injector.get(GafAuth0Service);
    auth.login();
  }
}

export const CustomAuth0Callbacks = new CustomAuth0CallbacksDefinition();
