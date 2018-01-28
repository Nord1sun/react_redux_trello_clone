import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ProfileImg from '../elements/ProfileImg';
import moment from 'moment';

class Event extends PureComponent {
  render() {
    const { event } = this.props;

    return (
      <div className="Event">
        <div className="row">
          <div className="col-1">
            <ProfileImg user={event.User}/>
          </div>
          <div className="col-11">
            {event.User.fullName} {event.action}
            <div className="text-muted"> on {moment(event.createdAt).format('MMM D, YYYY')}</div>
          </div>
        </div>
      </div>
    );
  }
}

Event.propTypes = {
  event: PropTypes.object.isRequired
};

export default Event;
