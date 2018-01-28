import { connect } from 'react-redux';
import BoardDisplay from '../../components/boards/BoardDisplay';
import { getBoards } from '../../actions/boardActions';

const mapStateToProps = (state) => {
  const { session, boardData } = state;
  const { selectedBoard, isFetching, error } = boardData;

  return {
    currentUser: session.user,
    selectedBoard,
    isFetching,
    error
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getBoards: () => {
      dispatch(getBoards());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BoardDisplay);
