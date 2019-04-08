import { GafStorageManager } from '../abstracts/gaf-storage-manager';

export interface IGafAuthentication {
  storage: GafStorageManager;
  isAuthenticated: boolean;
  login(): void;
  logout(): void;
  getEmail(): string;
  handleAuthentication(): Promise<boolean>;
  start(): void;
}
