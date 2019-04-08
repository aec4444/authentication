/* istanbul ignore next */
import { Injectable } from '@angular/core';
import { GafStorageManagerMock } from '@gaf/typescript-authentication-auth0';

@Injectable({
  providedIn: 'root'
})
export class GafStorageManagerMockService extends GafStorageManagerMock {
  constructor() {
    super();
  }
}
