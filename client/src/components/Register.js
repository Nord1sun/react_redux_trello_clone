import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';
import { Link } from 'react-router-dom';

class Register extends Component {
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
            <h2 className="text-center">Welcome to PlanX!</h2>
            <h6 className="text-center">Register new account</h6>
            {sessionError.message && <Alert color="danger">{sessionError.message}</Alert>}
            <Card>
              <CardBody>
                <Form onSubmit={(e) => onSubmit(history, e)}>
                  <FormGroup>
                    <Label for="name">Name</Label>
                    <Input type="text" name="name" id="name" />
                  </FormGroup>
                  <FormGroup>
                    <Label for="email">Email</Label>
                    <Input type="email" name="email" id="email" />
                  </FormGroup>
                  <FormGroup>
                    <Label for="password">Password</Label>
                    <Input type="password" name="password" id="password" />
                  </FormGroup>
                  <div className="d-flex justify-content-between align-items-center">
                    <Button color="primary">Register</Button>
                    <Link to="/login" style={{ color: '#000' }}>Sign in</Link>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  sessionError: PropTypes.object.isRequired,
  authenticated: PropTypes.bool.isRequired,
  redirectLoggedIn: PropTypes.func.isRequired
};

export default Register;
