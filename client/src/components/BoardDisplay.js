import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, FormGroup, Label, Col, Input, Alert } from 'reactstrap';
import Loader from './elements/Loader';
import BoardTitleContainer from '../containers/BoardTitleContainer';

class BoardDisplay extends PureComponent {
  componentWillReceiveProps(newProps) {
    const { currentUser, getBoards } = newProps;
    if (currentUser !== this.props.currentUser) getBoards(currentUser.id);
  }

  render() {
    const { boards, selectedBoard, isFetching, error, selectBoard,
      createBoard, deleteBoard} = this.props;
    const boardOptions = boards.map(board => {
      return (
        <option key={board.id}>{board.title}</option>
      );
    });

    return (
      <div className="Board container-fluid">
        {error ? <Alert color="danger">{error}</Alert> : null}
        {isFetching
          ? <Loader />
          : (
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
                        <a
                          href=""
                          className="delete-board-link"
                          onClick={(e) => deleteBoard(selectedBoard.id, e)}>Delete Board
                        </a>
                      )
                      : null}
                    <a href="" onClick={createBoard}>New Board</a>
                  </div>
                </div>
              </div>
            </div>
          )}
      </div>
    );
  }
}

BoardDisplay.propTypes = {
  currentUser: PropTypes.object.isRequired,
  getBoards: PropTypes.func.isRequired,
  boards: PropTypes.array.isRequired,
  selectedBoard: PropTypes.object,
  isFetching: PropTypes.bool,
  error: PropTypes.string,
  selectBoard: PropTypes.func.isRequired,
  createBoard: PropTypes.func.isRequired,
  deleteBoard: PropTypes.func.isRequired
};

export default BoardDisplay;
