import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardText, Modal, ModalHeader, ModalBody } from 'reactstrap';
import Member from './Member';
import Event from './Event';

class ListCard extends PureComponent {
  constructor() {
    super();
    this.state = { isModalOpen: false };
    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal(e) {
    if (e) e.preventDefault();
    this.setState({ isModalOpen: !this.state.isModalOpen });
  }

  render() {
    const { card } = this.props;
    const members = card.Users.map(user => <Member user={user} key={user.id}/>);
    const activity = card.Events.map(event => <Event event={event} key={event.id}/>);

    return (
      <div className="ListCard">
        <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal} tag="h5" className="list-card-header">
            {card.description}
          </ModalHeader>
          <ModalBody className="list-card-body">
            <div className="row justify-content-between card-header-info">
              <div className="col-sm-4">
                <small><span className="text-muted">In list:</span> {card.List.title}</small>
              </div>
              <div className="col-sm-4 text-right">
                <small><a href="" className="card-link">Mark Completed</a></small>
              </div>
            </div>
            <div className="Members">
              <h5>Members</h5>
              {members}
              <small><a href="" className="card-link">Add Member</a></small>
            </div>
            <div className="Activity">
              <h5>Activity</h5>
              {activity}
            </div>
          </ModalBody>
        </Modal>

        <a href="" onClick={this.toggleModal}>
          <Card>
            <CardBody>
              <CardText>
                {card.description}
              </CardText>
            </CardBody>
          </Card>
        </a>
      </div>
    );
  }
}

ListCard.propTypes = {
  card: PropTypes.object.isRequired
};

export default ListCard;
