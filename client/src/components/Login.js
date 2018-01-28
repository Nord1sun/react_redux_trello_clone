import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
            <h6 className="text-center">Please login to continue</h6>
            {sessionError.message && <Alert color="danger">{sessionError.message}</Alert>}
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

export default Login;
