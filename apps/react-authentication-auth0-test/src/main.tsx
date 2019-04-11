import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { App } from './app/app';
import configureStore from './app/configureStore';

const store = configureStore();

ReactDOM.render(<App store={store} />, document.querySelector('gaf-root'));
