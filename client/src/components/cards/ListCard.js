import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardText, Modal, ModalHeader, ModalBody, Input } from 'reactstrap';
import CardStatus from './CardStatus';
import MemberContainer from '../../containers/MemberContainer';
import Event from './Event';
import AddMemberFormContainer from '../../containers/AddMemberFormContainer';

class ListCard extends Component {
  constructor(props) {
    super(props);
    const descriptionLength = props.card.description.length - 1;
    this.state = {
      isModalOpen: false,
      currentTitleInput: props.card.description,
      textareaHeight: `${ descriptionLength - (descriptionLength * 0.15) }px`,
    };

    this.toggleModal = this.toggleModal.bind(this);
    this.adjustTextareaHeight = this.adjustTextareaHeight.bind(this);
  }

  toggleModal(e) {
    if (e) e.preventDefault();
    this.setState({ isModalOpen: !this.state.isModalOpen });
  }

  adjustTextareaHeight(e) {
    const hiddenListDesc = document.getElementById('hidden-description');

    if (hiddenListDesc) {
      this.setState({
        currentTitleInput: e ? e.target.value : this.state.currentTitleInput
      }, () => {
        this.setState({
          textareaHeight: `${ hiddenListDesc.clientHeight - (hiddenListDesc.clientHeight * .1) }px`
        });
      });
    }
  }

  render() {
    const { card, updateCard, markCompleted, deleteCard, isMember } = this.props;
    const members = card.Users.map(user => <MemberContainer card={card} user={user} key={user.id}/>);
    const activity = card.Events.map(event => <Event event={event} key={event.id}/>);

    return (
      <div className="ListCard">
        <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal} tag="h5" className="list-card-header">
            <span id="hidden-description">{this.state.currentTitleInput}</span>
            <Input
              type="textarea"
              className="TitleInput CardDescription"
              defaultValue={card.description}
              style={{ height: this.state.textareaHeight }}
              onChange={this.adjustTextareaHeight}
              onBlur={(e) => updateCard(card, e)}
              disabled={!isMember}
            />
          </ModalHeader>
          <ModalBody className="list-card-body">
            <div className="row justify-content-between card-header-info">
              <div className="col-sm-4">
                <small><span className="text-muted">In list:</span> {card.List.title}</small>
              </div>
              <CardStatus
                card={card}
                isMember={isMember}
                markCompleted={markCompleted}
                deleteCard={deleteCard}
              />
            </div>
            <div className="Members">
              <h5>Members</h5>
              {members}
              {isMember
                ? <AddMemberFormContainer card={card}/>
                : null}
            </div>
            <div className="Activity">
              <h5>Activity</h5>
              {activity}
            </div>
          </ModalBody>
        </Modal>

        <a href="" onClick={this.toggleModal}>
          <Card color={card.completed ? "success" : ""}>
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
  card: PropTypes.object.isRequired,
  updateCard: PropTypes.func.isRequired,
  markCompleted: PropTypes.func.isRequired,
  deleteCard: PropTypes.func.isRequired,
  isMember: PropTypes.bool
};

export default ListCard;
