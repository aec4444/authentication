import { ISessionProfile } from './ISessionProfile';

export interface ISession {
  idToken?: string;
  accessToken?: string;
  refreshToken?: string;
  profile?: ISessionProfile;
}
