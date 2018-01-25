import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input, Collapse, Card, CardBody, CardHeader, Alert } from 'reactstrap';
import MemberResultRow from './MemberResultRow';
import Loader from '../elements/Loader';

class AddMemberForm extends PureComponent {
  constructor() {
    super();
    this.state = { isAddMemberOpen: false };
    this.toggleAddMember = this.toggleAddMember.bind(this);
  }

  toggleAddMember(e) {
    if (e) e.preventDefault();
    this.setState({ isAddMemberOpen: !this.state.isAddMemberOpen });
  }

  render() {
    const { card, searchUsers, userSearchResults, addMember, isFetching, error } = this.props;

    const existingMemberIds = card.Users.map(c => c.id);
    const userResults = userSearchResults.map(user => {
      if (!existingMemberIds.includes(user.id)) {
        return <MemberResultRow key={user.id} card={card} user={user} addMember={addMember}/>;
      }
      return null;
    });
    const searchResults = userResults.length ? userResults : <div className="text-muted no-result-msg">No results</div>;

    return (
      <div className="AddMemberForm">
        <small className="card-link" onClick={this.toggleAddMember}>Add Member</small>
        <Collapse isOpen={this.state.isAddMemberOpen}>
          <Card>
            <CardHeader>
              <button
                type="button"
                className="close text-right"
                aria-label="Close"
                onClick={this.toggleAddMember}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </CardHeader>
            <CardBody>
              <Input
                placeholder="Search Users"
                onChange={(e) => searchUsers(card.id, e)}
                id="SearchMembers"
              />
              {error ? <Alert color="danger">{error}</Alert> : null}
              {isFetching
                ? <Loader />
                : searchResults}
            </CardBody>
          </Card>
        </Collapse>
      </div>
    );
  }
}

AddMemberForm.propTypes = {
  card: PropTypes.object.isRequired,
  searchUsers: PropTypes.func.isRequired,
  userSearchResults: PropTypes.array.isRequired,
  addMember: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  error: PropTypes.string
};

export default AddMemberForm;
