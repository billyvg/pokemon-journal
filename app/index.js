import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import routes from './routes';
import configureStore from './store/configureStore';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {
  Provider as MobxProvider,
} from 'mobx-react';

import authStore from './store/authStore';

import './app.global.css';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const store = configureStore();
const history = syncHistoryWithStore(hashHistory, store);

render(
  <Provider store={store}>
    <MobxProvider
      authStore={authStore}
    >
      <Router history={history} routes={routes} />
    </MobxProvider>
  </Provider>,
  document.getElementById('root')
);

