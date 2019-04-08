import { GafAuth0Settings } from '@gaf/typescript-authentication-auth0';
import { GafAuthenticationMode } from '@gaf/typescript-authentication-general';
import { API_CUSTOM_SCOPES } from './scopes';
import { CustomerSearchModuleConfig } from '../app/models/customer-search-config';
import { GuaranteeRegistrationConfig } from '../app/models/guarantee-registration-config';
import { RoofProjectConfig } from '../app/models/roof-project-config';
import { TeamNestJsConfig } from '../app/models/team-nestJs-config';
import { ApplicationConfig } from '../app/models/app-config';

export const environment: ApplicationConfig = {
  production: true,
  useNestJs: false
};

export const AUTH0_CONFIG: GafAuth0Settings = {
  clientId: '',
  domain: '',
  accessTokenThreshold: 15000,
  audience: '',
  // loginUri: 'https://cczintmnr.gaf.com',
  // logoutUri: 'https://cczintmnr.gaf.com',
  loginUri: 'https://customerinventorydev.gaf.com',
  logoutUri: 'https://customerinventorydev.gaf.com',
  redirectUri: 'http://local.gaf.com:4200',
  scopes: API_CUSTOM_SCOPES,
  whitelistDomains: [
    'customerinventorydev.gaf.com',
    'warrantyregdev.gaf.com'
  ]
};

export const CUSTOMER_INVENTORY_SEARCH_CONFIG: CustomerSearchModuleConfig = {
  pageSize: 100,
  baseUrl: 'https://customerinventorydev.gaf.com/customerinventory-api/v1/SalesPerson',
  useMockData: false
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
