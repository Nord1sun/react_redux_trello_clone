import { connect } from 'react-redux';
import List from '../components/List';
import { updateTitle } from '../actions/listActions';
import { moveCard } from '../actions/cardActions';

const mapStateToProps = (state) => {
  return {
    selectedBoard: state.boardData.selectedBoard
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateTitle: (listId, e) => {
      const title = e.target.value;
      dispatch(updateTitle(listId, title));
    },
    moveCard: (data) => {
      dispatch(moveCard(data));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(List);
