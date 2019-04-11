import { action } from 'typesafe-actions';
import { ResponseWithCount } from '../models/response-with-count';
import { Customer } from './models/customers';

export const enum CustomerActionTypes {
  FETCH_REQUEST = 'CUSTOMER/FETCH_REQUEST',
  FETCH_SUCCESS = 'CUSTOMER/FETCH_SUCCESS',
  FETCH_ERROR = 'CUSTOMER/FETCH_ERROR',
  FETCH_NEXT_PAGE = 'CUSTOMER/FETCH_NEXT_PAGE'
}

export const fetchSuccess = (data: ResponseWithCount<Customer>) => action(CustomerActionTypes.FETCH_SUCCESS, data);
export const fetchError = (data: Error) => action(CustomerActionTypes.FETCH_ERROR, data);
export const fetchRequest = () => action(CustomerActionTypes.FETCH_REQUEST);
export const fetchNextPage = () => action(CustomerActionTypes.FETCH_NEXT_PAGE);
