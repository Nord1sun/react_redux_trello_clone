import { connect } from 'react-redux';
import AddMemberForm from '../../components/cards/AddMemberForm';
import { searchNonMembers, addMember } from '../../actions/cardActions';

const mapStateToProps = (state) => {
  const { userSearchResults, isFetching, error } = state.card;
  return {
    userSearchResults,
    isFetching,
    error
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    searchUsers: (cardId, e) => {
      const searchTerm = e.target.value;
      dispatch(searchNonMembers(cardId, searchTerm));
    },
    addMember: (cardId, userId, e) => {
      e.preventDefault();
      document.getElementById('SearchMembers').value = '';
      dispatch(addMember(cardId, userId));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddMemberForm);
