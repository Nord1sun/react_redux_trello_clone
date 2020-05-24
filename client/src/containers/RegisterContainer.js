import serialize from 'form-serialize';
import { register } from '../actions/sessionActions';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Register from '../components/Register';

const mapStateToProps = (state) => {
  return {
    authenticated: state.session.authenticated,
    sessionError: state.sessionError
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    redirectLoggedIn: (authenticated, history) => {
      if (authenticated) {
        history.push('/');
      }
    },

    onSubmit: (history, e) => {
      e.preventDefault();
      const form = e.target;
      const userInfo = serialize(form, { hash: true });

      dispatch(register(userInfo, history));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Register));

