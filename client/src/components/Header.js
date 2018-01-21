import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { logout } from '../actions/sessionActions';
import { Collapse, Navbar, NavbarToggler, Nav, UncontrolledDropdown,
  DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import ProfileImg from './elements/ProfileImg';

class Header extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isNavbarOpen: false
    };
  }
  toggle() {
    this.setState({
      isNavbarOpen: !this.state.isNavbarOpen
    });
  }
  render() {
    const { session, history, logout, boards, selectedBoard, selectBoard, createBoard } = this.props;

    const boardLinks = boards.map(board => {
      return (
        <DropdownItem key={board.id} tag="a" href="" onClick={selectBoard}>
          {board.title}
        </DropdownItem>
      );
    });

    return (
      <div className="App-header">
        <Navbar color="faded" light expand="md">
          <h2 className="App-title">Djello</h2>
          <NavbarToggler onClick={this.toggle} />
          {session.authenticated
            ? (
              <Collapse isOpen={this.state.isNavbarOpen} navbar>
                <Nav className="ml-auto" navbar>
                  <UncontrolledDropdown nav innavbar="true">
                    <DropdownToggle nav caret>
                      {selectedBoard
                        ? selectedBoard.title
                        : 'Boards'}
                    </DropdownToggle>
                    <DropdownMenu >
                      {boardLinks}
                      <DropdownItem divider />
                      <DropdownItem tag="a" href="" onClick={createBoard}>
                        + New Board
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                  <UncontrolledDropdown nav innavbar="true" className="profile-navlink">
                    <DropdownToggle nav caret>
                      <ProfileImg user={session.user}/>
                      {session.user.fullName}
                    </DropdownToggle>
                    <DropdownMenu >
                      <DropdownItem tag="a" onClick={(e) => logout(history, e)} href="">
                        Logout
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </Nav>
              </Collapse>
            )
            : null}
        </Navbar>
      </div>
    );
  }
}

Header.propTypes = {
  session: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  boards: PropTypes.array,
  selectedBoard: PropTypes.object,
  selectBoard: PropTypes.func.isRequired,
  createBoard: PropTypes.func.isRequired
};

const mapdispatchToProps = (dispatch) => {
  return {
    logout: (history, e) => {
      e.preventDefault();
      dispatch(logout(history));
    }
  };
};

export default connect(null, mapdispatchToProps)(withRouter(Header));
