import { connect } from 'react-redux';
import BoardTitle from '../components/BoardTitle';
import { toggleFormVisability, updateBoardTitle } from '../actions/boardTitleActions';
import serialize from 'form-serialize';

const mapStateToProps = (state) => {
  const { isFormVisable, error, isFetching } = state.boardTitle;
  return {
    isFormVisable,
    error,
    isFetching,
    selectedBoard: state.boardData.selectedBoard
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleTitleForm: (e) => {
      e.preventDefault();
      dispatch(toggleFormVisability());
    },

    hideTitleForm: (e) => {
      e.preventDefault();
      this.setState({ titleFormVisable: false });
    },

    updateTitle: (board, e) => {
      e.preventDefault();
      const boardInput = serialize(e.target, { hash: true });
      dispatch(updateBoardTitle(board.id, boardInput.title));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BoardTitle);
