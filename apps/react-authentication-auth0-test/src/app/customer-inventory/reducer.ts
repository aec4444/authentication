import { CustomerState } from './types';
import { Reducer } from 'redux';
import { CustomerActionTypes } from './actions';

export const initialState: CustomerState = {
  pageData: [],
  count: 0,
  page: 0,
  loading: false
};

// Reducer
const reducer: Reducer<CustomerState> = (state = initialState, action) => {
  switch (action.type) {
    case CustomerActionTypes.FETCH_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      }
    case CustomerActionTypes.FETCH_NEXT_PAGE:
      return {
        ...state,
        page: state.page + 1,
        loading: true
      }
    case CustomerActionTypes.FETCH_REQUEST:
      return {
        ...state,
        page: 0,
        loading: true
      }
    case CustomerActionTypes.FETCH_SUCCESS:
      if (action.payload.isSuccess) {
        return {
          ...state,
          pageData: action.payload.item,
          count: action.payload.count,
          loading: false
        }
      } else {
        return {
          ...state,
          error: new Error(action.payload.exception),
          loading: false
        }
      }
    default:
      return {
        ...initialState
      }
  }
}

export { reducer as CustomerReducer };
