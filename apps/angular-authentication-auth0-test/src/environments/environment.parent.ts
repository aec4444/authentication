
import { GafAuth0Settings } from '@gaf/typescript-authentication-auth0';
import { GafAuthenticationMode } from '@gaf/typescript-authentication-general';
import { API_CUSTOM_SCOPES, API_GUARANTEEREGISTRATION_SCOPES, ROOF_PROJECT_SCOPES } from './scopes';
import { CustomerSearchModuleConfig } from '../app/models/customer-search-config';
import { GuaranteeRegistrationConfig } from '../app/models/guarantee-registration-config';
import { RoofProjectConfig } from '../app/models/roof-project-config';
import { TeamNestJsConfig } from '../app/models/team-nestJs-config';
import { ApplicationConfig } from '../app/models/app-config';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment: ApplicationConfig = {
  production: false,
  useNestJs: false
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

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

  scopes: [
    { audience: 'https://apigw.gaf.com/dev/api/v1/bi/salescenter/api/v1', scopes: API_CUSTOM_SCOPES, key: 'customerInventory' },
    { audience: 'https://warrantyregdev.gaf.com/', scopes: API_GUARANTEEREGISTRATION_SCOPES, key: 'guaranteeRegistration'},
    { audience: 'https://gafapidev.gaf.com/gafone/roofprojects/api/v1', scopes: ROOF_PROJECT_SCOPES, key: 'roofProject'}
  ],
  mode: GafAuthenticationMode.Parent
};

export const CUSTOMER_INVENTORY_SEARCH_CONFIG: CustomerSearchModuleConfig = {
  pageSize: 100,
  baseUrl: 'https://customerinventorydev.gaf.com/customerinventory-api/v1/SalesPerson',
  useMockData: false,
  emulate: 'psuser1@gaf.com'
};

export const GUARANTEE_REGISTRATION_CONFIG: GuaranteeRegistrationConfig = {
  baseUrl: 'https://warrantyregdev.gaf.com/api/channelapi/api/v1/Lookups'
};

export const ROOF_PROJECT_CONFIG: RoofProjectConfig = {
  baseUrl: 'https://apigw.gaf.com/dev/api/custportal/v1/roofproject'
};

export const TEAM_NESTJS_CONFIG: TeamNestJsConfig = {
  baseUrl: 'http://localhost:3000'
};
