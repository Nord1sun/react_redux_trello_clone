import { sessionService } from 'redux-react-session';

export const SET_SESSION_ERROR = 'SET_SESSION_ERROR';
export const REMOVE_SESSION_ERROR = 'REMOVE_SESSION_ERROR';

const setSessionError = (error) => {
  return {
    type: SET_SESSION_ERROR,
    error
  };
};

const removeSessionError = () => {
  return { type: REMOVE_SESSION_ERROR };
};

export const login = (user, history) => {
  return (dispatch) => {
    dispatch(removeSessionError());

    const userInfo = JSON.stringify(user);

    return fetch('/api/v1/sessions/new', {
      method: 'POST',
      body: userInfo,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        return response.json();
      })
      .then(userData => {
        if (!userData.token) throw new Error(userData.message);
        const { token } = userData;
        sessionService.saveSession({ token })
          .then(() => {
            return sessionService.saveUser(userData.data);
          })
          .then(() => {
            dispatch(removeSessionError());
            history.push('/');
          })
          .catch(err => console.error(err));
      })
      .catch(err => dispatch(setSessionError(err)));
  };
};

export const logout = (history) => {
  return (dispatch) => {
    return sessionService.deleteSession()
      .then(() => {
        return sessionService.deleteUser();
      })
      .then(() => {
        dispatch(removeSessionError());
        history.push('/login');
      })
      .catch(err => console.error(err));
  };
};
