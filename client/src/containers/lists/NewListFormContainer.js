import { connect } from 'react-redux';
import NewListForm from '../../components/lists/NewListForm';
import serialize from 'form-serialize';
import { addNewList, toggleNewListForm } from '../../actions/listActions';

const mapStateToProps = (state) => {
  return {
    board: state.boardData.selectedBoard,
    isOpen: state.list.isNewFormOpen,
    error: state.list.error
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onNewList: (e) => {
      e.preventDefault();
      const form = serialize(e.target, { hash: true });
      dispatch(addNewList(form));
    },
    toggle: (e) => {
      e.preventDefault();
      dispatch(toggleNewListForm());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewListForm);
