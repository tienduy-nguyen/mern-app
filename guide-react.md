# Guide React-Client in MERN app

## Create react app

- We will use create-react-app
  ```
  $ npx create-react-app client
  $ cd client
  $ npm i axios react-router-dom redux-react-redux redux-thunk moment
  $ npm run dev
  ```
- Delete unused files `App.test.js`, `index.css`, `logo.svg`, `serviceWorker.js` and delete import in `index.js` and `App.js`
  
## Components
- Create components in client folder
  ```
  $ mkdir components
  $ cd components
  $ mkdir layout
  $ mkdir auth
  $ touch auth/Login.js auth/Register.js
  $ touch layout/Alert.js layout/Landing.js layout/Navbar.js
  ```

  See details in each file
## Implement Redux

- Create `store.js`
  ```js
  import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
  import { composeWithDevTools } from 'redux-devtools-extension';
  import thunk from 'redux-thunk';
  import rootReducer from './reducers/index';

  const initialState = {};
  const middleware = [thunk];

  const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
  );

  export default store;

  ```
- Create `reducers` folder and create `index.js` in it
  ```js
  //reducers/index.js
  import { combineReducers } from 'redux';
  import alert from './alert';
  import auth from './auth';

  export default combineReducers({
    alert,
    auth,
  });

  ```
  We will put initial start for each components in reducer.
  
- Add `provider` in `client/index.js`
  ```js
  import React from 'react';
  import ReactDOM from 'react-dom';
  import App from './App';

  //Redux
  import store from './store';
  import { Provider } from 'react-redux';

  ReactDOM.render(
    <Provider store={store}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Provider>,

    document.getElementById('root')
  );

  ```