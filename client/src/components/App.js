import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import Header from './Header';
import BoardDisplayContainer from '../containers/BoardDisplayContainer';
import Login from './Login';
import PrivateRoute from './PrivateRoute';

const App = ({ session }) => (
  <div className="App">
    <Router>
      { session.checked &&
        <div>
          <Header session={session} />
          <PrivateRoute exact path="/" component={BoardDisplayContainer} authenticated={session.authenticated}/>
          <Route path="/login" component={Login}/>
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
