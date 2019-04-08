import { ISessionProfile } from './ISessionProfile';

export interface ISession {
  idToken?: string;
  accessToken?: string;
  profile?: ISessionProfile;
}
