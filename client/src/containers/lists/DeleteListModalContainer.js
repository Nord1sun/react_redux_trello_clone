import { connect } from 'react-redux';
import DeleteListModal from '../../components/lists/DeleteListModal';
import { deleteList} from '../../actions/listActions';

const mapDispatchToProps = (dispatch) => {
  return {
    deleteList: (listId, e) => {
      e.preventDefault();
      dispatch(deleteList(listId));
    }
  };
};

export default connect(null, mapDispatchToProps)(DeleteListModal);
