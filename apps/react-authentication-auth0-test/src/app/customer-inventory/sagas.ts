import { CUSTOMER_INVENTORY_SEARCH_CONFIG } from "../../environments/environment";
import { GafAuth0Manager } from '../auth/gaf-auth0-manager';
import { all, call, fork, put, takeEvery, takeLatest, select } from 'redux-saga/effects'
import { fetchError, fetchSuccess, CustomerActionTypes } from './actions';
import { ApplicationState } from '../store';

let count = 0;

// return the URL needed
const getUrl = (page: number, pageSize: number, search: string): string => {
  let url = `${CUSTOMER_INVENTORY_SEARCH_CONFIG.baseUrl}/SalesPersonCustomerList/${getEmail()}`;
  const params = new URLSearchParams();
  params.set('pageNum', page.toString());
  params.set('pageSize', pageSize.toString());

  if (search !== undefined && search !== null && search !== '') {
    params.set('filter', search);
  }

  url = `${url}?${params.toString()}`;
  return url
};

const getEmail = (): string => {
  if (CUSTOMER_INVENTORY_SEARCH_CONFIG.emulate !== undefined &&
      CUSTOMER_INVENTORY_SEARCH_CONFIG.emulate !== null &&
      CUSTOMER_INVENTORY_SEARCH_CONFIG.emulate !== '') {
    return CUSTOMER_INVENTORY_SEARCH_CONFIG.emulate;
  }
  return GafAuth0Manager.storage.info.profile.email;
}

async function callApi(token: string, method: string, url: string, data?: any) {
  const res = await fetch(url, {
    method,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      Authorization2: GafAuth0Manager.storage.info.idToken,
      User: GafAuth0Manager.storage.info.profile.email
    }
  })

  return await res.json();
}

const getPage = (state: ApplicationState) => state.customers.page;

function* handleFetch() {
  try {
    const page = yield select(getPage);
    const url = getUrl(page + 1, CUSTOMER_INVENTORY_SEARCH_CONFIG.pageSize, '');

    const token = yield call([GafAuth0Manager, GafAuth0Manager.getAccessToken], url);
    if (token.error) {
      yield put(fetchError(token.error));
    } else {
      const res = yield call(callApi, token, 'get', url);

      if (res.error) {
        yield put(fetchError(res.error));
      } else {
        yield put(fetchSuccess(res))
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      yield put(fetchError(err))
    } else {
      yield put(fetchError(new Error('Unknown Error')));
    }
  }
}

function* watchFetchRequest() {
  yield takeEvery(CustomerActionTypes.FETCH_REQUEST, handleFetch);
}

function *watchFetchNextPage() {
  yield takeEvery(CustomerActionTypes.FETCH_NEXT_PAGE, handleFetch);
}

function *customerSaga() {
  yield all([fork(watchFetchRequest), fork(watchFetchNextPage)]);
}

export default customerSaga;
