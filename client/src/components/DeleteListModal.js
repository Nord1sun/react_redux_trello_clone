import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

class DeleteListModal extends PureComponent {
  render() {
    const { list, deleteList, toggle, isOpen } = this.props;

    return (
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>Delete {list.title}</ModalHeader>
        <ModalBody>
          Are you sure you want to delete this list? This action will also remove any cards attached.
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={(e) => deleteList(list.id, e)} className="form-button">Delete</Button>
          <Button color="secondary" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    );
  }
}

DeleteListModal.propTypes = {
  list: PropTypes.object.isRequired,
  deleteList: PropTypes.func.isRequired,
  toggle: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired
};

export default DeleteListModal;
