import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { logout } from '../actions/sessionActions';
import { Collapse, Navbar, NavbarToggler, Nav, NavItem, NavLink } from 'reactstrap';

class Header extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    const { session, history, logout } = this.props;

    return (
      <div className="App-header">
        <Navbar color="faded" light expand="md">
          <h2 className="App-title">Djello</h2>
          <NavbarToggler onClick={this.toggle} />
          {session.authenticated
            ? (
              <Collapse isOpen={this.state.isOpen} navbar>
                <Nav className="ml-auto" navbar>
                  <NavItem className="navUserId">
                    Welcome {session.user.fullName}!
                  </NavItem>
                  <NavItem>
                    <NavLink href="" onClick={(e) => logout(history, e)}>Logout</NavLink>
                  </NavItem>
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
  history: PropTypes.object.isRequired
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
