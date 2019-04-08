import { GafAuthentication, GafTokenManager, GafStorageManager } from '@gaf/typescript-authentication-general';
import { GafAuth0Settings } from '../config/gaf-auth0-settings';
import { GafAuth0Callbacks } from '../config/gaf-auth0-callbacks';
import { IGafAuth0 } from './IGafAuth0';

export abstract class GafAuth0 extends GafAuthentication implements IGafAuth0 {
  constructor(
    public config: GafAuth0Settings,
    public callbacks: GafAuth0Callbacks,
    protected tokenManager: GafTokenManager,
    public storage: GafStorageManager,
  ) {
    super(storage);
  }

  abstract getAccessToken(url?: string): Promise<string>;
}
