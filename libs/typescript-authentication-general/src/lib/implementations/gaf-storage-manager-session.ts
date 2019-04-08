import { GafStorageManager } from '../abstracts/gaf-storage-manager';
import { ISession } from '../interfaces/ISession';

/**
 * Generic implementation of session storage for authentication
 */
export class GafStorageManagerSession extends GafStorageManager {
  private _session!: ISession | undefined;
  public storageKey = 'gaf-auth0-info';

  /**
   * Retrieve from session storage the object stored in the storageKey key.
   */
  public get info(): ISession {
    if (this._session === undefined) {
      const sessionString = sessionStorage.getItem(this.storageKey);

      if (sessionString !== undefined && sessionString !== null && sessionString !== '') {
        try {
          this._session = JSON.parse(sessionString);
        } catch (ex) {
          this._session = {};
        }
      } else {
        this._session = {};
      }
    }

    return this._session || {};
  }

  /**
   * This will persist the value into session storage with the key of storageKey
   */
  public set info(value: ISession) {
    if (value === undefined) {
      this.clear();
    } else {
      sessionStorage.setItem(this.storageKey, JSON.stringify(value));
    }
    this._session = value;
  }

  public clear(): void {
    sessionStorage.removeItem(this.storageKey);
    this._session = undefined;
  }
}
