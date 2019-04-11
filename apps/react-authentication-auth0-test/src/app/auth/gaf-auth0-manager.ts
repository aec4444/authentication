import { GafAuth0Browser } from '@gaf/typescript-authentication-auth0';
import { AUTH0_CONFIG } from '../../environments/environment';
import { GafTokenManager, GafStorageManagerSession } from '@gaf/typescript-authentication-general';


export const GafAuth0Manager = new GafAuth0Browser(
  AUTH0_CONFIG,
  {},
  new GafTokenManager(),
  new GafStorageManagerSession()
);

GafAuth0Manager.start();
