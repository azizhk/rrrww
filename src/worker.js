import React from 'react';
import { Provider } from 'react-redux'
import devToolsEnhancer from 'remote-redux-devtools';

import App from './App';
import { createStore } from 'redux'
import reducer from './reducer'

const store = createStore(
  reducer,
  devToolsEnhancer({
    port: 8000
  })
)

const dom = (
  <Provider store={store}>
    <App />
  </Provider>
);
