import { ISessionProfile } from '@gaf/typescript-authentication-general';

export class GafAuth0SessionProfile implements ISessionProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  name?: string;
  nickname?: string;
}
