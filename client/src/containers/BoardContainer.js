import { connect } from 'react-redux';
import Board from '../components/boards/Board';
import serialize from 'form-serialize';
import { addNewList, toggleNewListForm, updateTitle, deleteList } from '../actions/listActions';

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
    },
    updateListTitle: (listId, e) => {
      const title = e.target.value;
      setTimeout(() => {
        dispatch(updateTitle(listId, title));
      }, 1000);
    },
    deleteList: (listId, e) => {
      e.preventDefault();
      dispatch(deleteList(listId));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Board);
