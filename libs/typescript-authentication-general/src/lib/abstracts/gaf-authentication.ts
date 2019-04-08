import { GafStorageManager } from './gaf-storage-manager';
import { IGafAuthentication } from '../interfaces/IGafAuthentication';

export abstract class GafAuthentication implements IGafAuthentication {
  constructor(public storage: GafStorageManager) {}

  //#region Abstract Interface
  public abstract isAuthenticated: boolean;
  public abstract login(): void;
  public abstract logout(): void;
  public abstract getEmail(): string;
  public abstract handleAuthentication(): Promise<boolean>;
  public abstract start(): void;
  //#endregion
}
