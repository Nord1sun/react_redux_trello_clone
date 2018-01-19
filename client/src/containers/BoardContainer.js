import { connect } from 'react-redux';
import Board from '../components/boards/Board';

const mapStateToProps = (state) => {
  return {
    board: state.boardData.selectedBoard
  };
};

export default connect(mapStateToProps)(Board);
