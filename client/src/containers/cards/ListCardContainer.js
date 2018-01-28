import { connect } from 'react-redux';
import ListCard from '../../components/cards/ListCard';
import { updateCard, deleteCard } from '../../actions/cardActions';

const mapStateToProps = (state, ownProps) => {
  const lineAmount = ownProps.card.description.length / 37;
  const height = (lineAmount * 15) + 50;

  const memberIds = ownProps.card.Users.map(u => u.id);
  const isMember = memberIds.includes(state.session.user.id);

  return {
    textareaHeight: state.card.textareaHeight || `${ height }px`,
    isFetching: state.card.isFetching,
    isMember,
    card: ownProps.card || {}
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateCard: (card, e) => {
      const description = e.target.value;
      setTimeout(() => {
        dispatch(updateCard(card, { description, completed: card.completed }));
      }, 1000);
    },
    markCompleted: (card, e) => {
      e.preventDefault();
      dispatch(updateCard(card, { description: card.description, completed: true }));
    },
    deleteCard: (cardId, e) => {
      e.preventDefault();
      dispatch(deleteCard(cardId));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListCard);
