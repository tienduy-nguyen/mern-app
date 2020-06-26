import React, { Fragment } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';

const App = () => (
  <Router>
    <Fragment>
      <Navbar></Navbar>
      <Route exact path='/' component={Landing}></Route>
      <section class='container'>
        <Switch>
          <Route exact path='/register' component={Register}></Route>
          <Route exact path='/login' component={Login}></Route>
        </Switch>
      </section>
    </Fragment>
  </Router>
);

export default App;
