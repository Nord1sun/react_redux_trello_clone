import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, FormGroup, Label, Col, Input } from 'reactstrap';
import BoardTitleContainer from '../../containers/BoardTitleContainer';
import DeleteBoardModal from './DeleteBoardModal';

class BoardDisplayHeading extends PureComponent {
  constructor() {
    super();
    this.state = {
      deleteModalOpen: false
    };

    this.toggleDeleteModal = this.toggleDeleteModal.bind(this);
  }

  toggleDeleteModal(e) {
    e.preventDefault();
    this.setState({ deleteModalOpen: !this.state.deleteModalOpen});
  }

  render() {
    const { boards, selectedBoard, selectBoard, createBoard, deleteBoard} = this.props;
    const boardOptions = boards.map(board => {
      return (
        <option key={board.id}>{board.title}</option>
      );
    });

    return (
      <div className="row justify-content-between align-items-center">
        <div className="col-md-4">
          {selectedBoard
            ? <BoardTitleContainer board={selectedBoard} />
            : null}
        </div>
        <div className="col-md-4">
          {boards.length
            ? (
              <Form>
                <FormGroup row className="select-board">
                  <Label for="board" sm={5}>Select Board:</Label>
                  <Col sm={7}>
                    <Input type="select" name="board" value={selectedBoard.title} onChange={selectBoard}>
                      {boardOptions}
                    </Input>
                  </Col>
                </FormGroup>
              </Form>
            )
            : null}
          <div className="container">
            <div className="row justify-content-end board-links">
              {selectedBoard
                ? (
                  <div className="DeleteBoard">
                    <a
                      href=""
                      className="delete-board-link"
                      onClick={this.toggleDeleteModal}>Delete Board
                    </a>
                    <DeleteBoardModal
                      isOpen={this.state.deleteModalOpen}
                      toggle={this.toggleDeleteModal}
                      selectedBoard={selectedBoard}
                      deleteBoard={deleteBoard}
                    />
                  </div>
                )
                : null}
              <a href="" onClick={createBoard}>New Board</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

BoardDisplayHeading.propTypes = {
  boards: PropTypes.array.isRequired,
  selectedBoard: PropTypes.object,
  selectBoard: PropTypes.func.isRequired,
  createBoard: PropTypes.func.isRequired,
  deleteBoard: PropTypes.func.isRequired
};

export default BoardDisplayHeading;
