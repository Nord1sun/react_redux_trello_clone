import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardFooter, Form,
  FormGroup, Input, Button, Alert } from 'reactstrap';

class NewCardFrom extends PureComponent {
  constructor() {
    super();
    this.state = {
      isAddCardOpen: false
    };
    this.toggleAddCard = this.toggleAddCard.bind(this);
  }

  toggleAddCard(e) {
    if (e) e.preventDefault();
    this.setState({
      isAddCardOpen: !this.state.isAddCardOpen
    });
  }

  render() {
    const { onNewCard, list, error } = this.props;

    if (this.state.isAddCardOpen) {
      return (
        <Card>
          {error && <Alert color="danger">{error}</Alert>}
          <CardBody>
            <Form onSubmit={(e) => onNewCard(this.toggleAddCard, e)}>
              <FormGroup key={list.id}>
                <Input type="hidden" name="ListId" value={list.id}/>
                <Input type="textarea" name="description" className="addCardDescription"/>
              </FormGroup>
              <Button color="success" size="sm" className="form-button">Add</Button>
              <a href="" className="cancel-edit-link" onClick={this.toggleAddCard}>X</a>
            </Form>
          </CardBody>
        </Card>
      );
    } else {
      return (
        <a href="/" onClick={this.toggleAddCard}>
          <CardFooter>
            Add a card...
          </CardFooter>
        </a>
      );
    }
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
