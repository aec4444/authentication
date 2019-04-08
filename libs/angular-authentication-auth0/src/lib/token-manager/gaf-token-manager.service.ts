import { Injectable } from '@angular/core';
import { GafTokenManager } from '@gaf/typescript-authentication-general';

@Injectable({
  providedIn: 'root'
})
export class GafTokenManagerService extends GafTokenManager {
  constructor() {
    super();
  }
}
