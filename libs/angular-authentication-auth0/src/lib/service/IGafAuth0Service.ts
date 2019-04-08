import { IGafAuth0 } from '@gaf/typescript-authentication-auth0';
import { EventEmitter } from '@angular/core';

export interface IGafAuth0Service extends IGafAuth0 {
  onAuthenticationChanged: EventEmitter<boolean>;
  onRenewError: EventEmitter<any>;
}
