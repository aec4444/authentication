import { ApplicationState, createRootReducer, rootSaga } from './store';
import { Store, createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { composeWithDevTools } from 'redux-devtools-extension'
import { initialState } from './customer-inventory/reducer';

const applicationInitialState: ApplicationState = {
  customers: initialState
};

export default function configureStore(
  initialState: ApplicationState = applicationInitialState
): Store<ApplicationState> {
  const composeEnhancers = composeWithDevTools({});

  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    createRootReducer(),
    initialState,
    composeEnhancers(applyMiddleware(sagaMiddleware))
  );

  sagaMiddleware.run(rootSaga);
  return store;
}
