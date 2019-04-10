import * as React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';

import './app.scss';
import { Home } from './components/home/home';
import { Callback } from './components/callback/callback';

export const App = () => (
  <BrowserRouter>
    <div className="app">
      <nav className="app-nav">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
        </ul>
      </nav>
      <div className="app-content">
        <Route path="/" exact component={Home} />
        <Route path="/callback" exact component={Callback} />
      </div>
    </div>
  </BrowserRouter>
);
