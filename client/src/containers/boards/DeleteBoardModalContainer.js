import { connect } from 'react-redux';
import DeleteBoardModal from '../../components/boards/DeleteBoardModal';
import { deleteBoard } from '../../actions/boardActions';


const mapStateToProps = (state) => {
  return {
    selectedBoard: state.boardData.selectedBoard
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deleteBoard: (id, e) => {
      e.preventDefault();
      dispatch(deleteBoard(id));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteBoardModal);
