import { connect } from 'react-redux';
import Board from '../components/boards/Board';
import serialize from 'form-serialize';
import { addNewList, toggleNewListForm } from '../actions/listActions';

const mapStateToProps = (state) => {
  return {
    board: state.boardData.selectedBoard,
    isNewFormOpen: state.list.isNewFormOpen,
    listFormError: state.list.error
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onNewList: (e) => {
      e.preventDefault();
      const form = serialize(e.target, { hash: true });
      dispatch(addNewList(form));
    },
    toggleListForm: (e) => {
      e.preventDefault();
      dispatch(toggleNewListForm());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Board);
