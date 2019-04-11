import { GafAuth0Settings } from '@gaf/typescript-authentication-auth0';
import { GafAuthenticationMode } from '@gaf/typescript-authentication-general';
import { API_CUSTOM_SCOPES } from './scopes';
import { CustomerSearchModuleConfig } from '../app/models/customer-search-config';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false
};

export const AUTH0_CONFIG: GafAuth0Settings = {
  clientId: 'datK1TCUtFgsKMmELO3OJqQ8Edg2u3Tl',
  domain: 'ssodev.gaf.com',
  accessTokenThreshold: 15000,
  audience: 'https://apigw.gaf.com/dev/api/v1/bi/salescenter/api/v1',
  loginUri: 'http://local.gaf.com',
  logoutUri: 'http://local.gaf.com',
  redirectUri: 'http://local.gaf.com/callback',

  whitelistDomains: [
    'customerinventorydev.gaf.com',
    'warrantyregdev.gaf.com',
    'apigw.gaf.com'
  ],

  scopes: API_CUSTOM_SCOPES,
  mode: GafAuthenticationMode.Parent
};

export const CUSTOMER_INVENTORY_SEARCH_CONFIG: CustomerSearchModuleConfig = {
  pageSize: 100,
  baseUrl: 'https://customerinventorydev.gaf.com/customerinventory-api/v1/SalesPerson',
  useMockData: false,
  emulate: 'psuser1@gaf.com'
};
