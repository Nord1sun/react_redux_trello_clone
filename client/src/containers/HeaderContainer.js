import { connect } from 'react-redux';
import Header from '../components/Header';
import { selectBoard, createBoard } from '../actions/boardActions';

const mapStateToProps = (state) => {
  return {
    boards: state.boardData.boards,
    selectedBoard: state.boardData.selectedBoard
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    selectBoard: (e) => {
      e.preventDefault();
      dispatch(selectBoard(e.target.text));
    },
    createBoard: (e) => {
      e.preventDefault();
      dispatch(createBoard());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
