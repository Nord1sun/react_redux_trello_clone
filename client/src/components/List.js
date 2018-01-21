import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardBody, CardFooter, Input,
  Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import ListCard from './ListCard';


class List extends PureComponent {
  constructor() {
    super();
    this.state = { isDeleteModalOpen: false };
    this.toggleDeleteModal = this.toggleDeleteModal.bind(this);
  }

  toggleDeleteModal(e) {
    e.preventDefault();
    this.setState({
      isDeleteModalOpen: !this.state.isDeleteModalOpen
    });
  }

  render() {
    const { list, updateTitle, deleteList } = this.props;
    const cards = list.Cards.map(card => {
      return <ListCard key={card.id} card={card}/>;
    });

    return (
      <Card className="List pull-left">
        <CardHeader>
          <Input
            type="textarea"
            rows="1"
            className="TitleInput"
            onBlur={(e) => updateTitle(list.id, e)}>{list.title}
          </Input>
          <a href="" className="DeleteList" onClick={this.toggleDeleteModal}>X</a>
        </CardHeader>
        <CardBody className="ListBody">
          {cards}
        </CardBody>
        <a href="">
          <CardFooter>
            Add a card...
          </CardFooter>
        </a>

        <Modal isOpen={this.state.isDeleteModalOpen} toggle={this.toggleDeleteModal}>
          <ModalHeader toggle={this.toggleDeleteModal}>Delete {list.title}</ModalHeader>
          <ModalBody>
            Are you sure you want to delete this list? This action will also remove any cards attached.
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={(e) => deleteList(list.id, e)} className="form-button">Delete</Button>
            <Button color="secondary" onClick={this.toggleDeleteModal}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </Card>
    );
  }
}

List.propTypes = {
  list: PropTypes.object.isRequired,
  updateTitle: PropTypes.func.isRequired,
  deleteList: PropTypes.func.isRequired
};

export default List;
