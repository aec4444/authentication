import { GafStorageManager } from '@gaf/typescript-authentication-general';
import { GafAuth0Session } from '../models/GafAuth0Session';

export class GafStorageManagerMock extends GafStorageManager {
  public get info(): GafAuth0Session {
    const value = new GafAuth0Session();

    value.accessToken =
      'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJpc3MiOiJodHRwczovL2p3dC1pZHAuZXhhbXBsZS5jb20iLCJzdWIiOiJtYWlsdG86bWlrZUBleGFtcGxlLmNvbSIsIm5iZiI6MTU1MDE0OTg4MiwiZXhwIjoxNTgxNjg1ODgyLCJpYXQiOjE1NTAxNDk4ODIsImp0aSI6ImlkMTIzNDU2IiwidHlwIjoiaHR0cHM6Ly9leGFtcGxlLmNvbS9yZWdpc3RlciJ9.'; //tslint:disable-line
    value.idToken =
      'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJpc3MiOiJodHRwczovL2p3dC1pZHAuZXhhbXBsZS5jb20iLCJzdWIiOiJtYWlsdG86bWlrZUBleGFtcGxlLmNvbSIsIm5iZiI6MTU1MDE0OTg4MiwiZXhwIjoxNTgxNjg1ODgyLCJpYXQiOjE1NTAxNDk4ODIsImp0aSI6ImlkMTIzNDU2IiwidHlwIjoiaHR0cHM6Ly9leGFtcGxlLmNvbS9yZWdpc3RlciJ9.'; //tslint:disable-line
    value.profile = {
      email: 'a@b.com',
      firstName: 'first name',
      lastName: 'last name',
      nickname: 'nickname',
      name: 'Last, First',
    };

    return value;
  }

  public set info(value: GafAuth0Session) {
    // do nothing
  }

  public clear(): void {
    // do nothing
  }
}
