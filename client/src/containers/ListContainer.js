import { connect } from 'react-redux';
import List from '../components/List';

const mapStateToProps = (state) => {
  return {
    selectedBoard: state.boardData.selectedBoard
  };
};

export default connect(mapStateToProps)(List);
