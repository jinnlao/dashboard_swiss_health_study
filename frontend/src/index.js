import 'react-app-polyfill/ie11';
import 'url-search-params-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';


// Remove logs in production
if (process.env.NODE_ENV !== 'development') {
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
