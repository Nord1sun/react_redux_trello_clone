import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

class DeleteBoardModal extends PureComponent {
  render() {
    const { isOpen, toggle, selectedBoard, deleteBoard } = this.props;
    return (
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>Delete Board</ModalHeader>
        <ModalBody>
          Are you sure you want to delete <span className="bold">{selectedBoard.title}</span>? This action will also remove all lists and cards associated with your board.
        </ModalBody>
        <ModalFooter>
          <Button className="delete-board-button" color="danger" onClick={(e) => deleteBoard(selectedBoard.id, e)}>Delete</Button>{' '}
          <Button color="secondary" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    );
  }
}

DeleteBoardModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  selectedBoard: PropTypes.object.isRequired,
  deleteBoard: PropTypes.func.isRequired
};

export default DeleteBoardModal;
