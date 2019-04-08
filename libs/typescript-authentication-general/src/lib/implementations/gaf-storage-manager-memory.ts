import { ISession } from '../interfaces/ISession';
import { GafStorageManager } from '../abstracts/gaf-storage-manager';

export class GafStorageManagerMemory extends GafStorageManager {
  public info: ISession = {};
  public clear(): void {
    this.info = {};
  }
}
