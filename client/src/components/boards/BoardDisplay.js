import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'reactstrap';
import Loader from '../elements/Loader';
import BoardDisplayHeading from './BoardDisplayHeading';
import BoardContainer from '../../containers/BoardContainer';

class BoardDisplay extends PureComponent {
  componentDidMount() {
    const { currentUser, getBoards } = this.props;
    getBoards(currentUser.id);
  }

  componentWillReceiveProps(newProps) {
    const { currentUser, getBoards } = newProps;
    if (currentUser !== this.props.currentUser) getBoards(currentUser.id);
  }

  render() {
    const { selectedBoard, isFetching, error, deleteBoard} = this.props;

    return (
      <div className="Board container-fluid">
        {error ? <Alert color="danger">{error}</Alert> : null}
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
  boards: PropTypes.array.isRequired,
  selectedBoard: PropTypes.object,
  isFetching: PropTypes.bool,
  error: PropTypes.string,
  deleteBoard: PropTypes.func.isRequired
};

export default BoardDisplay;
