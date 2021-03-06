import { GafAuth0Browser, GafAuth0Callbacks, WindowLocation } from '@gaf/typescript-authentication-auth0';
import { AUTH0_CONFIG } from '../../environments/environment';
import { GafTokenManager, GafStorageManagerSession } from '@gaf/typescript-authentication-general';

export const callbacks: GafAuth0Callbacks = {
  getScopesKeyFromUrl: (url: string) => 'audience'
}

export const GafAuth0Manager = new GafAuth0Browser(
  AUTH0_CONFIG,
  callbacks,
  new GafTokenManager(),
  new GafStorageManagerSession(),
  new WindowLocation()
);

GafAuth0Manager.start();
