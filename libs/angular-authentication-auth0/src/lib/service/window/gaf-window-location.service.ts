import { Injectable } from '@angular/core';
import { WindowLocation } from '@gaf/typescript-authentication-auth0';

@Injectable()
export class GafWindowLocationService extends WindowLocation {
  constructor() {
    super();
  }
}
