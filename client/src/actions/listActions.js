import { checkStatus } from '../helpers/fetchHelper';
import { sessionService } from 'redux-react-session';

export const ADD_LIST_REQUEST = 'ADD_LIST_REQUEST';
export const ADD_LIST_SUCCESS = 'ADD_LIST_SUCCESS';
export const ADD_LIST_FAILURE = 'ADD_LIST_FAILURE';
export const TOGGLE_NEW_FORM = 'TOGGLE_NEW_FORM';
export const UPDATE_LIST_REQUEST = 'UPDATE_LIST_REQUEST';
export const UPDATE_LIST_SUCCESS = 'UPDATE_LIST_SUCCESS';
export const UPDATE_LIST_FAILURE = 'UPDATE_LIST_FAILURE';

export function addListRequest() {
  return { type: ADD_LIST_REQUEST };
}

export function addListSuccess(data) {
  return {
    type: ADD_LIST_SUCCESS,
    data
  };
}

export function addListFailure(error) {
  return {
    type: ADD_LIST_FAILURE,
    error
  };
}

export function addNewList(listData) {
  return (dispatch) => {
    dispatch(addListRequest());

    sessionService.loadSession()
      .then(session => {
        return fetch(`/api/v1/lists?token=${ session.token }`, {
          method: 'POST',
          body: JSON.stringify(listData),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
      })
      .then(checkStatus)
      .then(data => {
        dispatch(addListSuccess(data));
      })
      .catch(e => dispatch(addListFailure(e)));
  };
}

export function toggleNewListForm() {
  return { type: TOGGLE_NEW_FORM };
}

export function updateListRequest() {
  return { type: UPDATE_LIST_REQUEST };
}

export function updateListSuccess(data) {
  return {
    type: UPDATE_LIST_SUCCESS,
    data
  };
}

export function updateListFailure(error) {
  return {
    type: UPDATE_LIST_FAILURE,
    error
  };
}

export function updateTitle(id, title) {
  return (dispatch) => {
    dispatch(updateListRequest());

    sessionService.loadSession()
      .then(session => {
        return fetch(`/api/v1/lists/${ id }?token=${ session.token }`, {
          method: 'PUT',
          body: JSON.stringify({ title }),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
      })
      .then(checkStatus)
      .then(data => {
        dispatch(updateListSuccess(data));
      })
      .catch(e => dispatch(updateListFailure(e)));
  };
}
