import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, Form, FormGroup, Input, Button, Alert } from 'reactstrap';

class NewListFrom extends PureComponent {
  render() {
    const { onNewList, board, toggle, error } = this.props;
    return (
      <Card className="List NewList">
        {error ? <Alert color="danger">{error}</Alert> : null}
        <CardBody>
          <Form onSubmit={onNewList}>
            <FormGroup key={board.id}>
              <Input type="hidden" name="BoardId" value={board.id}/>
              <Input type="text" name="title" placeholder="List title"/>
            </FormGroup>
            <Button color="success" size="sm" className="form-button">Add</Button>
            <a href="" className="cancel-edit-link" onClick={toggle}>X</a>
          </Form>
        </CardBody>
      </Card>
    );
  }
}

NewListFrom.propTypes = {
  onNewList: PropTypes.func.isRequired,
  board: PropTypes.object.isRequired,
  toggle: PropTypes.func.isRequired,
  error: PropTypes.string
}

export default NewListFrom;
