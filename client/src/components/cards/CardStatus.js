import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class CardStatus extends PureComponent {
  render() {
    const { card, isMember, deleteCard, markCompleted } = this.props;
    if (isMember) {
      return (
        <div className="col-sm-4 text-right">
          {card.completed
            ? (
              <div>
                <span className="text-success complete">Completed</span>
                <small><a href="" className="card-link" onClick={(e) => deleteCard(card.id, e)}>Delete Card</a></small>
              </div>
            )
            : <small><a href="" className="card-link" onClick={(e) => markCompleted(card, e)}>Mark Completed</a></small>}
        </div>
      );
    } else {
      return (
        <div className="col-sm-4 text-right">
          {card.completed
            ? (
              <div>
                <span className="text-success complete">Completed</span>
              </div>
            )
            : null}
        </div>
      );
    }
  }
}

CardStatus.propTypes = {
  card: PropTypes.object.isRequired,
  isMember: PropTypes.bool.isRequired,
  deleteCard: PropTypes.func.isRequired,
  markCompleted: PropTypes.func.isRequired
};

export default CardStatus;
