import { Response } from './response';

export class ResponseWithCount<T> extends Response<Array<T>> {
  public count: number;
}
