export class DataWithCount<T> {
  data: Array<T>;
  count: number;

  constructor(data: Array<T>, count: number) {
    this.data = data;
    this.count = count;
  }
}
