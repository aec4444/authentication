import { ISession } from '../interfaces/ISession';

export abstract class GafStorageManager {
  public abstract info: ISession;
  public abstract clear(): void;
}
