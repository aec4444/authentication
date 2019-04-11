import { combineReducers } from 'redux';
import { CustomerReducer, initialState } from '../customer-inventory/reducer';
import { CustomerState } from '../customer-inventory/types';
import customerSaga from '../customer-inventory/sagas';
import { fork, all } from 'redux-saga/effects';

// top level state
export interface ApplicationState {
  customers: CustomerState
}

// export const initialApplicationState: ApplicationState = {
//   customers: initialState
// }

// Whenever an action is dispatched, Redux will update each top-level application state property
// using the reducer with the matching name. It's important that the names match exactly, and that
// the reducer acts on the corresponding ApplicationState property type.

export const createRootReducer = () =>
  combineReducers({
    customers: CustomerReducer
  });

export function* rootSaga() {
  yield all([fork(customerSaga)]);
}
