import { connect } from 'react-redux';
import NewCardForm from '../../components/cards/NewCardForm';
import serialize from 'form-serialize';
import { addCard } from '../../actions/cardActions';

const mapStateToProps = (state) => {
  return {
    error: state.card.error
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onNewCard: (toggle, e) => {
      e.preventDefault();
      const form = e.target;
      const data = serialize(e.target, { hash: true });

      form.reset();
      toggle();

      dispatch(addCard(data));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewCardForm);
