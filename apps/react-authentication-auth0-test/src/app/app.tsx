import * as React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import { Provider } from 'react-redux'

import './app.scss';
import { Home } from './components/home/home';
import { Callback } from './components/callback/callback';

export const App = ({store}) => (
  <Provider store={store}>
    <BrowserRouter>
      <div className="app">
        <div className="app-content">
          <Route path="/" exact component={Home} />
          <Route path="/callback" exact component={Callback} />
        </div>
      </div>
    </BrowserRouter>
  </Provider>
);
