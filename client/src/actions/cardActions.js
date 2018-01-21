import { checkStatus } from '../helpers/fetchHelper';
import { sessionService } from 'redux-react-session';

export const UPDATE_CARD_REQUEST = 'UPDATE_CARD_REQUEST';
export const UPDATE_CARD_SUCCESS = 'UPDATE_CARD_SUCCESS';
export const UPDATE_CARD_FAILURE = 'UPDATE_CARD_FAILURE';
export const DELETE_CARD_REQUEST = 'DELETE_CARD_REQUEST';
export const DELETE_CARD_SUCCESS = 'DELETE_CARD_SUCCESS';
export const DELETE_CARD_FAILURE = 'DELETE_CARD_FAILURE';

function updateCardRequest() {
  return { type: UPDATE_CARD_REQUEST };
}

function updateCardSuccess(data) {
  return {
    type: UPDATE_CARD_SUCCESS,
    data
  };
}

function updateCardFailure(error) {
  return {
    type: UPDATE_CARD_FAILURE,
    error
  };
}

export function updateCard(card, body) {
  return (dispatch) => {
    dispatch(updateCardRequest());

    sessionService.loadSession()
      .then(session => {
        return fetch(`/api/v1/cards/${ card.id }?token=${ session.token }`, {
          method: 'PUT',
          body: JSON.stringify(body),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
      })
      .then(checkStatus)
      .then(data => {
        dispatch(updateCardSuccess(data));
      })
      .catch(e => dispatch(updateCardFailure(e)));
  };
}

function deleteCardRequest() {
  return { type: DELETE_CARD_REQUEST };
}

function deleteCardSuccess(data) {
  return {
    type: UPDATE_CARD_SUCCESS,
    data
  };
}

function deleteCardFailure(error) {
  return {
    type: UPDATE_CARD_FAILURE,
    error
  };
}

export function deleteCard(id) {
  return (dispatch) => {
    dispatch(deleteCardRequest());

    sessionService.loadSession()
      .then(session => {
        return fetch(`/api/v1/cards/${ id }?token=${ session.token }`, {
          method: 'DELETE'
        });
      })
      .then(checkStatus)
      .then(data => {
        dispatch(deleteCardSuccess(data));
      })
      .catch(e => dispatch(deleteCardFailure(e)));
  };
}
