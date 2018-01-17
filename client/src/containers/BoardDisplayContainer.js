import { connect } from 'react-redux';
import BoardDisplay from '../components/BoardDisplay';
import { getBoards, selectBoard, createBoard, deleteBoard } from '../actions/boardActions';

const mapStateToProps = (state) => {
  const { session, boardData } = state;
  const { boards, selectedBoard, isFetching, error } = boardData;
  return {
    currentUser: session.user,
    boards,
    selectedBoard,
    isFetching,
    error
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getBoards: (userId) => {
      dispatch(getBoards(userId));
    },

    selectBoard: (e) => {
      dispatch(selectBoard(e.target.value));
    },

    createBoard: (e) => {
      e.preventDefault();
      dispatch(createBoard());
    },

    deleteBoard: (id, e) => {
      e.preventDefault();
      dispatch(deleteBoard(id));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BoardDisplay);
