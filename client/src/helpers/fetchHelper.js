import { sessionService } from 'redux-react-session';

export function checkStatus(response) {
  if (!response.ok) {
    const error = new Error(response.message);
    error.response = response;
    return response.json(error);
  }

  return response.json();
}

export function apiRequest(data) {
  let { url, method, body, dispatch, onSuccess, onFail } = data;

  url.includes('?') ? url += '&' : url += '?';

  sessionService.loadSession()
    .then(session => {
      return fetch(`${ url }token=${ session.token }`, {
        method: method,
        body: body ? JSON.stringify(body) : null,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
    })
    .then(checkStatus)
    .then(resultData => {
      if (resultData.status === 200) {
        dispatch(onSuccess(resultData));
      } else {
        dispatch(onFail(resultData));
      }
    })
    .catch(e => dispatch(onFail(e)));
}
