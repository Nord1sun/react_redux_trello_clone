import { sessionService } from 'redux-react-session';

export const SET_SESSION_ERROR = 'SET_SESSION_ERROR';
export const REMOVE_SESSION_ERROR = 'REMOVE_SESSION_ERROR';
export const USER_LOGOUT = 'USER_LOGOUT';

const setSessionError = (error) => {
  return {
    type: SET_SESSION_ERROR,
    error
  };
};

const removeSessionError = () => {
  return { type: REMOVE_SESSION_ERROR };
};

const userLogout = () => {
  return { type: USER_LOGOUT };
};

export const register = (user, history) => {
  return (dispatch) => {
    dispatch(removeSessionError());

    return fetch('/api/v1/sessions/register', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(userData => {
        if (!userData.token) throw new Error(userData.message);
        const { token } = userData;
        sessionService.saveSession({ token })
          .then(() => {
            sessionService.saveUser(userData.data);
          })
          .then(() => {
            dispatch(removeSessionError());
            history.push('/');
          })
          .catch(console.error);
      })
      .catch(err => dispatch(setSessionError(err)));
  };
}

export const login = (user, history) => {
  return (dispatch) => {
    dispatch(removeSessionError());

    return fetch('/api/v1/sessions/new', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(userData => {
        if (!userData.token) throw new Error(userData.message);
        const { token } = userData;
        sessionService.saveSession({ token })
          .then(() => {
            sessionService.saveUser(userData.data);
          })
          .then(() => {
            dispatch(removeSessionError());
            history.push('/');
          })
          .catch(console.error);
      })
      .catch(err => dispatch(setSessionError(err)));
  };
};

export const logout = (history) => {
  return (dispatch) => {
    return sessionService.deleteSession()
      .then(() => {
        sessionService.deleteUser();
      })
      .then(() => {
        dispatch(userLogout());
        dispatch(removeSessionError());
        history.push('/login');
      })
      .catch(console.error);
  };
};
