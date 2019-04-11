export class Response<T> {
    public errorMessage: string;
    public isSuccess: Boolean;
    public item: T;
    public exception: any;
}
