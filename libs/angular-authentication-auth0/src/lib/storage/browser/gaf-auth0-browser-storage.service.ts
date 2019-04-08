import { Injectable } from '@angular/core';
import { GafStorageManagerSession } from '@gaf/typescript-authentication-general';

@Injectable({
  providedIn: 'root'
})
export class GafAuth0BrowserStorageService extends GafStorageManagerSession {
  constructor() {
    super();
  }
}
