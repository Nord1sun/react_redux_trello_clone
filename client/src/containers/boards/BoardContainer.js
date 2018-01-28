import { connect } from 'react-redux';
import Board from '../../components/boards/Board';
import { reorderLists } from '../../actions/listActions';

const mapStateToProps = (state) => {
  return {
    board: state.boardData.selectedBoard
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    reorderLists: (boardId, listId, orderNum) => {
      dispatch(reorderLists({ boardId, listId, orderNum }));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Board);
