
import { IGafAuth0Service } from './IGafAuth0Service';
import { EventEmitter } from '@angular/core';
import { GafStorageManager } from '@gaf/typescript-authentication-general';
import { GafAuth0Settings, GafAuth0Callbacks as TypescriptGafAuth0Callbacks} from '@gaf/typescript-authentication-auth0';
import { GafAuth0Callbacks } from '../config/gaf-auth0-callbacks';

/**
 * This abstract class is set as a DEPENDENCY TOKEN for injection.  It's not intended to be used as a base class, but it certainly could be.
 */
export abstract class GafAuth0Service implements IGafAuth0Service {
  public abstract onAuthenticationChanged: EventEmitter<boolean>;
  public abstract onRenewError: EventEmitter<any>;
  public abstract storage: GafStorageManager;
  public abstract isAuthenticated: boolean;
  public abstract config: GafAuth0Settings;
  public abstract callbacks: TypescriptGafAuth0Callbacks;
  public abstract callbacksAngular: GafAuth0Callbacks;

  public abstract login(): void;
  public abstract logout(): void;
  public abstract getEmail(): string;
  public abstract handleAuthentication(): Promise<boolean>;
  public abstract start(): void;
  abstract getAccessToken(url?: string): Promise<string>;
}
