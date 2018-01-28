import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, Form, FormGroup, Input, Button, Alert } from 'reactstrap';

class NewListForm extends PureComponent {
  render() {
    const { isOpen, onNewList, board, toggle, error } = this.props;

    if (isOpen) {
      return (
        <Card className={board.Lists.length ? "List NewList" : "List"}>
          {error && <Alert color="danger">{error}</Alert>}
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
    } else {
      return (
        <a
          href="/"
          className={board && board.Lists.length ? "add-list shift-down" : "add-list"}
          onClick={toggle}
        >
          <Card className="AddList pull-left">
            Add a list...
          </Card>
        </a>
      );
    }
  }
}

NewListForm.propTypes = {
  onNewList: PropTypes.func.isRequired,
  board: PropTypes.object.isRequired,
  toggle: PropTypes.func.isRequired,
  error: PropTypes.string,
  isOpen: PropTypes.bool.isRequired
};

export default NewListForm;
