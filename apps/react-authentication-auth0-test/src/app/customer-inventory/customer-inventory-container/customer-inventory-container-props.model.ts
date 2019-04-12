import { Customer } from '../models/customers';

export interface CustomerInventoryContainerProps {
  pageData?: Customer[];
  count?: number;
  page?: number;
  pageSize?: number;
  fetchRequest?: () => any,
  fetchNextPage?: () => any
};
