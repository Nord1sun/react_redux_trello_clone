import { connect } from 'react-redux';
import Member from '../components/cards/Member';
import { removeMember } from '../actions/cardActions';

const mapStateToProps = (state, ownProps) => {
  return {
    isBoardOwner: ownProps.user.id === state.boardData.selectedBoard.UserId
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    removeMember: (cardId, userId, e) => {
      e.preventDefault();
      dispatch(removeMember(cardId, userId));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Member);
