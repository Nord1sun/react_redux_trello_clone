import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class ProfileImg extends PureComponent {
  render() {
    const { user } = this.props;
    return <img src={user.img} alt={user.fullName} className="profile-img"/>;
  }
}

ProfileImg.propTypes = {
  user: PropTypes.object.isRequired
};

export default ProfileImg;
