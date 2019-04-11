import { Customer } from './models/customers';

export interface CustomerState {
  pageData: Customer[],
  count: number;
  page: number;
  loading: boolean;
  error?: Error
}
