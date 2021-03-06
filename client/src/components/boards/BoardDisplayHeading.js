import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import BoardTitleContainer from '../../containers/boards/BoardTitleContainer';
import DeleteBoardModalContainer from '../../containers/boards/DeleteBoardModalContainer';

class BoardDisplayHeading extends PureComponent {
  constructor() {
    super();
    this.state = {
      deleteModalOpen: false
    };

    this.toggleDeleteModal = this.toggleDeleteModal.bind(this);
  }

  toggleDeleteModal(e) {
    if (e) e.preventDefault();
    this.setState({ deleteModalOpen: !this.state.deleteModalOpen});
  }

  render() {
    const { selectedBoard } = this.props;

    return (
      <div className="BoardDisplayHeading row justify-content-between align-items-center">
        <div className="col-md-4">
          {selectedBoard && <BoardTitleContainer />}
        </div>
        <div className="col-md-4">
          <div className="container">
            <div className="row justify-content-end board-links">
              {selectedBoard && !selectedBoard.notOwned &&
                <div className="DeleteBoard">
                  <a
                    href=""
                    className="delete-board-link"
                    onClick={this.toggleDeleteModal}>X
                  </a>
                  <DeleteBoardModalContainer
                    isOpen={this.state.deleteModalOpen}
                    toggle={this.toggleDeleteModal}
                  />
                </div>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

BoardDisplayHeading.propTypes = {
  boards: PropTypes.array,
  selectedBoard: PropTypes.object,
  deleteBoard: PropTypes.func.isRequired
};

export default BoardDisplayHeading;
