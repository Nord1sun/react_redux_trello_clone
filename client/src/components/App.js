import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import Header from './Header';
import Home from './Home';
import Login from './Login';
import PrivateRoute from './PrivateRoute';

const App = ({ session, checked }) => (
  <div className="App">
    <Router>
      { checked &&
        <div>
          <Header session={session} />
          <PrivateRoute exact path="/" component={Home} authenticated={session.authenticated}/>
          <Route path="/login" component={Login}/>
        </div>
      }
    </Router>
  </div>
);

const { bool, object } = PropTypes;

App.propTypes = {
  session: object.isRequired,
  checked: bool.isRequired
};

const mapStateToProps = ({ session }) => ({
  checked: session.checked,
  session: session
});

export default connect(mapStateToProps)(App);
