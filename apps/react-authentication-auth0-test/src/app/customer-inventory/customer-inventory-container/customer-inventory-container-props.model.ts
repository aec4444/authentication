import { Customer } from '../models/customers';

export interface CustomerInventoryContainerProps {
  pageData?: Customer[];
  count?: number;
  fetchRequest?: () => any,
  fetchNextPage?: () => any
};
