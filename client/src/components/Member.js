import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ProfileImg from './elements/ProfileImg';

class Member extends PureComponent {
  render() {
    const { user } = this.props;

    return (
      <div className="Member row justify-content-between">
        <div className="col-sm-4">
          <ProfileImg user={user}/>
          {user.fullName}
        </div>
        <div className="col-sm-4 text-right">
          <small><a href="" className="card-link">remove</a></small>
        </div>
      </div>
    );
  }
}

Member.propTypes = {
  user: PropTypes.object.isRequired
};

export default Member;
