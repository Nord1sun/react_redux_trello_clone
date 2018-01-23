import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, Form, FormGroup, Input, Button, Alert } from 'reactstrap';

class NewCardFrom extends PureComponent {
  render() {
    const { onNewCard, list, toggle, error } = this.props;
    return (
      <Card>
        {error ? <Alert color="danger">{error}</Alert> : null}
        <CardBody>
          <Form onSubmit={(e) => onNewCard(toggle, e)}>
            <FormGroup key={list.id}>
              <Input type="hidden" name="ListId" value={list.id}/>
              <Input type="textarea" name="description" className="addCardDescription"/>
            </FormGroup>
            <Button color="success" size="sm" className="form-button">Add</Button>
            <a href="" className="cancel-edit-link" onClick={toggle}>X</a>
          </Form>
        </CardBody>
      </Card>
    );
  }
}

NewCardFrom.propTypes = {
  onNewCard: PropTypes.func.isRequired,
  list: PropTypes.object.isRequired,
  toggle: PropTypes.func.isRequired,
  error: PropTypes.string
};

NewCardFrom.propTypes = {

};

export default NewCardFrom;
