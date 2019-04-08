import { IGafAuthentication } from '@gaf/typescript-authentication-general';
import { GafAuth0Settings } from '../config/gaf-auth0-settings';
import { GafAuth0Callbacks } from '../config/gaf-auth0-callbacks';

export interface IGafAuth0 extends IGafAuthentication {
  config: GafAuth0Settings;
  callbacks: GafAuth0Callbacks;

  getAccessToken(url?: string): Promise<string>;
}
