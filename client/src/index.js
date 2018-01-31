import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import { djello } from './reducers/appReducer';
import { sessionService } from 'redux-react-session';

let store;

if (process.env.NODE_ENV !== 'production') {
  // const {whyDidYouUpdate} = require('why-did-you-update');
  // whyDidYouUpdate(React);
  const { composeWithDevTools } = require('redux-devtools-extension');

  store = createStore(djello, composeWithDevTools(
    applyMiddleware(ReduxThunk)
  ));
} else {
  store = createStore(djello, applyMiddleware(ReduxThunk));
}



sessionService.initSessionService(store);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
