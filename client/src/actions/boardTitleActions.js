import { checkStatus } from '../helpers/fetchHelper';
import { sessionService } from 'redux-react-session';

export const TOGGLE_FORM_VISIBILITY = "TOGGLE_FORM_VISIBILITY";
export const UPDATE_TITLE_REQUEST = "UPDATE_TITLE_REQUEST";
export const UPDATE_TITLE_SUCCESS = "UPDATE_TITLE_SUCCESS";
export const UPDATE_TITLE_FAILURE = "UPDATE_TITLE_FAILURE";

export function toggleFormVisability() {
  return {
    type: TOGGLE_FORM_VISIBILITY
  };
}

export function updateTitleRequest() {
  return {
    type: UPDATE_TITLE_REQUEST
  };
}

export function updateTitleSuccess(data) {
  return {
    type: UPDATE_TITLE_SUCCESS,
    data
  };
}

export function updateTitleFailure(error) {
  return {
    type: UPDATE_TITLE_FAILURE,
    error
  };
}

export function updateBoardTitle(id, title) {
  return (dispatch) => {
    dispatch(updateTitleRequest());

    sessionService.loadSession()
      .then(session => {
        return fetch(`/api/v1/boards/${ id }?token=${ session.token }`, {
          method: 'PUT',
          body: JSON.stringify({ title }),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
      })
      .then(checkStatus)
      .then(boardData => {
        if (boardData.status === 200) {
          dispatch(updateTitleSuccess(boardData));
        } else {
          dispatch(updateTitleFailure(boardData));
        }
      })
      .catch(e => dispatch(updateTitleFailure(e)));
  };
}
