import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'reactstrap';
import Loader from '../elements/Loader';
import BoardDisplayHeading from './BoardDisplayHeading';
import BoardContainer from '../../containers/boards/BoardContainer';

class BoardDisplay extends PureComponent {
  componentDidMount() {
    this.props.getBoards();
  }

  componentWillReceiveProps(newProps) {
    const { currentUser, getBoards } = newProps;
    if (currentUser !== this.props.currentUser) getBoards();
  }

  render() {
    const { selectedBoard, isFetching, error, deleteBoard} = this.props;

    return (
      <div className="Board container-fluid">
        {error && <Alert color="danger">{error}</Alert>}
        {isFetching
          ? <Loader />
          : (
            <div className="BoardDisplay">
              <BoardDisplayHeading
                selectedBoard={selectedBoard}
                deleteBoard={deleteBoard}
              />
              <BoardContainer />
            </div>
          )}
      </div>
    );
  }
}

BoardDisplay.propTypes = {
  currentUser: PropTypes.object.isRequired,
  getBoards: PropTypes.func.isRequired,
  boards: PropTypes.array,
  selectedBoard: PropTypes.object,
  isFetching: PropTypes.bool,
  error: PropTypes.string,
  deleteBoard: PropTypes.func.isRequired
};

export default BoardDisplay;
