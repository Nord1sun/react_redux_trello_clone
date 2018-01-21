import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardText, Modal, ModalHeader,
  ModalBody, ModalFooter, Button } from 'reactstrap';

class ListCard extends PureComponent {
  constructor() {
    super();
    this.state = { isModalOpen: false };
    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal(e) {
    e.preventDefault();
    this.setState({ isModalOpen: !this.state.isModalOpen });
  }

  render() {
    const { card } = this.props;
    return (
      <div className="ListCard">
        <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>Modal title</ModalHeader>
          <ModalBody>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </ModalBody>
          <ModalFooter>
            <Button color="primary" className="form-button" onClick={this.toggleModal}>Do Something</Button>
            <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
          </ModalFooter>
        </Modal>

        <a href="" onClick={this.toggleModal}>
          <Card>
            <CardBody>
              <CardText>
                {card.description}
              </CardText>
            </CardBody>
          </Card>
        </a>
      </div>
    );
  }
}

ListCard.propTypes = {
  card: PropTypes.object.isRequired
};

export default ListCard;
