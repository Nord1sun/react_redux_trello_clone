import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ProfileImg from '../elements/ProfileImg';

class Member extends PureComponent {
  render() {
    const { card, user, removeMember, isBoardOwner } = this.props;

    return (
      <div className="Member row justify-content-between">
        <div className="col-sm-10">
          <ProfileImg user={user}/>
          {user.fullName}
        </div>
        <div className="col-sm-2 text-right">
          {!isBoardOwner
            ? (
              <small>
                <a href="" className="card-link" onClick={(e) => removeMember(card.id, user.id, e)}>remove</a>
              </small>
            )
            : <small className="text-muted">Owner</small>}
        </div>
      </div>
    );
  }
}

Member.propTypes = {
  card: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  removeMember: PropTypes.func.isRequired,
  isBoardOwner: PropTypes.bool.isRequired
};

export default Member;
