import { ISession } from '@gaf/typescript-authentication-general';
import { GafAuth0SessionProfile } from './GafAuth0SessionProfile';

export class GafAuth0Session implements ISession {
  public idToken?: string;
  public accessToken?: string;
  public refreshToken?: string;
  public profile?: GafAuth0SessionProfile;
}
