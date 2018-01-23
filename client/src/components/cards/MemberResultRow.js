import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ProfileImg from '../elements/ProfileImg';

class MemberResultRow extends PureComponent {
  render() {
    const { card, user, addMember } = this.props;
    return (
      <div className="MemberResultsRow row justify-content-between">
        <div className="col-sm-10">
          <ProfileImg user={user}/>
          {user.fullName}
        </div>
        <div className="col-sm-2 text-right">
          <small>
            <a href="" className="card-link" onClick={(e) => addMember(card.id, user.id, e)}>
              Add
            </a>
          </small>
        </div>
      </div>
    );
  }
}

MemberResultRow.propTypes = {
  user: PropTypes.object.isRequired,
  addMember: PropTypes.func.isRequired,
  card: PropTypes.object.isRequired
};

export default MemberResultRow;
