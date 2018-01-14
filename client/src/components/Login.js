import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import serialize from 'form-serialize';
import { login } from '../actions/sessionActions';
import { Card, CardBody, Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';

class Login extends Component {
  componentWillMount() {
    const { authenticated, redirectLoggedIn, history } = this.props;
    redirectLoggedIn(authenticated, history);
  }

  render() {
    const { onSubmit, history, sessionError } = this.props;

    return (
      <div className="Login container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <h2 className="text-center">Welcome to Djello Project Management!</h2>
            <h6 className="text-muted text-center">Please login to continue</h6>
            {sessionError.message
              ? <Alert color="danger">{sessionError.message}</Alert>
              : null}
            <Card>
              <CardBody>
                <Form onSubmit={(e) => onSubmit(history, e)}>
                  <FormGroup>
                    <Label for="email">Email</Label>
                    <Input type="email" name="email" id="email" />
                  </FormGroup>
                  <FormGroup>
                    <Label for="password">Password</Label>
                    <Input type="password" name="password" id="password" />
                  </FormGroup>
                  <Button color="primary">Sign in</Button>
                </Form>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  sessionError: PropTypes.object.isRequired,
  authenticated: PropTypes.bool.isRequired,
  redirectLoggedIn: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    authenticated: state.session.authenticated,
    sessionError: state.sessionError
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    redirectLoggedIn: (authenticated, history) => {
      if (authenticated) {
        history.push('/');
      }
    },

    onSubmit: (history, e) => {
      e.preventDefault();
      const form = e.target;
      const userInfo = serialize(form, { hash: true });

      dispatch(login(userInfo, history));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login));
