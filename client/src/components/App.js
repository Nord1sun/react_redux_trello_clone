import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import HeaderContainer from '../containers/HeaderContainer';
import BoardDisplayContainer from '../containers/boards/BoardDisplayContainer';
import LoginContainer from '../containers/LoginContainer';
import PrivateRoute from './PrivateRoute';
import RegisterContainer from '../containers/RegisterContainer';

const App = ({ session }) => (
  <div className="App">
    <Router>
      { session.checked &&
        <div>
          <HeaderContainer session={session} />
          <PrivateRoute exact path="/" component={BoardDisplayContainer} authenticated={session.authenticated}/>
          <Route path="/login" component={LoginContainer}/>
          <Route path="/register" component={RegisterContainer}/>
        </div>
      }
    </Router>
  </div>
);

App.propTypes = {
  session: PropTypes.object.isRequired
};

const mapStateToProps = ({ session }) => ({
  session: session
});

export default connect(mapStateToProps)(App);
