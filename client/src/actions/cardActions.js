import { checkStatus } from '../helpers/fetchHelper';
import { sessionService } from 'redux-react-session';

export const ADD_CARD_REQUEST = 'ADD_CARD_REQUEST';
export const ADD_CARD_SUCCESS = 'ADD_CARD_SUCCESS';
export const ADD_CARD_FAILURE = 'ADD_CARD_FAILURE';
export const UPDATE_CARD_REQUEST = 'UPDATE_CARD_REQUEST';
export const UPDATE_CARD_SUCCESS = 'UPDATE_CARD_SUCCESS';
export const UPDATE_CARD_FAILURE = 'UPDATE_CARD_FAILURE';
export const DELETE_CARD_REQUEST = 'DELETE_CARD_REQUEST';
export const DELETE_CARD_SUCCESS = 'DELETE_CARD_SUCCESS';
export const DELETE_CARD_FAILURE = 'DELETE_CARD_FAILURE';
export const SEARCH_NONMEMBER_REQUEST = 'SEARCH_NONMEMBER_REQUEST';
export const SEARCH_NONMEMBER_SUCCESS = 'SEARCH_NONMEMBER_SUCCESS';
export const SEARCH_NONMEMBER_FAILURE = 'SEARCH_NONMEMBER_FAILURE';
export const ADD_MEMBER_REQUEST = 'ADD_MEMBER_REQUEST';
export const ADD_MEMBER_SUCCESS = 'ADD_MEMBER_SUCCESS';
export const ADD_MEMBER_FAILURE = 'ADD_MEMBER_FAILURE';
export const REMOVE_MEMBER_REQUEST = 'REMOVE_MEMBER_REQUEST';
export const REMOVE_MEMBER_SUCCESS = 'REMOVE_MEMBER_SUCCESS';
export const REMOVE_MEMBER_FAILURE = 'REMOVE_MEMBER_FAILURE';
export const MOVE_CARD_SUCCESS = 'MOVE_CARD_SUCCESS';
export const MOVE_CARD_FAILURE = 'MOVE_CARD_FAILURE';


function addCardRequest() {
  return { type: ADD_CARD_REQUEST };
}

function addCardSuccess(data) {
  return {
    type: ADD_CARD_SUCCESS,
    data
  };
}

function addCardFailure(error) {
  return {
    type: ADD_CARD_FAILURE,
    error
  };
}

export function addCard(body) {
  return (dispatch) => {
    dispatch(addCardRequest());

    sessionService.loadSession()
      .then(session => {
        return fetch(`/api/v1/cards?token=${ session.token }`, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
      })
      .then(checkStatus)
      .then(data => {
        if (data.status === 200) {
          dispatch(addCardSuccess(data));
        } else {
          dispatch(addCardFailure(data));
        }
      })
      .catch(e => dispatch(addCardFailure(e)));
  };
}

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
        if (data.status === 200) {
          dispatch(updateCardSuccess(data));
        } else {
          dispatch(updateCardFailure(data));
        }
      })
      .catch(e => dispatch(updateCardFailure(e)));
  };
}

function deleteCardRequest() {
  return { type: DELETE_CARD_REQUEST };
}

function deleteCardSuccess(data) {
  return {
    type: DELETE_CARD_SUCCESS,
    data
  };
}

function deleteCardFailure(error) {
  return {
    type: DELETE_CARD_FAILURE,
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
        if (data.status === 200) {
          dispatch(deleteCardSuccess(data));
        } else {
          dispatch(deleteCardFailure(data));
        }
      })
      .catch(e => dispatch(deleteCardFailure(e)));
  };
}

function searchNonMembersRequest() {
  return {
    type: SEARCH_NONMEMBER_REQUEST
  };
}

function searchNonMembersSuccess(data) {
  return {
    type: SEARCH_NONMEMBER_SUCCESS,
    data
  };
}

function searchNonMembersFailure(error) {
  return {
    type: SEARCH_NONMEMBER_FAILURE,
    error
  };
}

export function searchNonMembers(id, term) {
  return (dispatch) => {
    dispatch(searchNonMembersRequest());

    sessionService.loadSession()
      .then(session => {
        return fetch(
          `/api/v1/cards/${ id }/search_non_members/?term=${ encodeURIComponent(term) }&token=${ session.token }`, {
            method: 'GET'
          }
        );
      })
      .then(checkStatus)
      .then(data => {
        if (data.status === 200) {
          dispatch(searchNonMembersSuccess(data));
        } else {
          dispatch(searchNonMembersFailure(data));
        }
      })
      .catch(e => dispatch(searchNonMembersFailure(e)));
  };
}

function addMembersRequest() {
  return {
    type: ADD_MEMBER_REQUEST
  };
}

function addMembersSuccess(data) {
  return {
    type: ADD_MEMBER_SUCCESS,
    data
  };
}

function addMembersFailure(error) {
  return {
    type: ADD_MEMBER_FAILURE,
    error
  };
}

export function addMember(cardId, userId) {
  return (dispatch) => {
    dispatch(addMembersRequest());

    sessionService.loadSession()
      .then(session => {
        return fetch(
          `/api/v1/cards/${ cardId }/add_member/${ userId }?token=${ session.token }`, {
            method: 'POST'
          }
        );
      })
      .then(checkStatus)
      .then(data => {
        if (data.status === 200) {
          dispatch(addMembersSuccess(data));
        } else {
          dispatch(addMembersFailure(data));
        }
      })
      .catch(e => dispatch(addMembersFailure(e)));
  };
}

function removeMembersRequest() {
  return {
    type: REMOVE_MEMBER_REQUEST
  };
}

function removeMembersSuccess(data) {
  return {
    type: REMOVE_MEMBER_SUCCESS,
    data
  };
}

function removeMembersFailure(error) {
  return {
    type: REMOVE_MEMBER_FAILURE,
    error
  };
}

export function removeMember(cardId, userId) {
  return (dispatch) => {
    dispatch(removeMembersRequest());

    sessionService.loadSession()
      .then(session => {
        return fetch(
          `/api/v1/cards/${ cardId }/remove_member/${ userId }?token=${ session.token }`, {
            method: 'DELETE'
          }
        );
      })
      .then(checkStatus)
      .then(data => {
        if (data.status === 200) {
          dispatch(removeMembersSuccess(data));
        } else {
          dispatch(removeMembersFailure(data));
        }
      })
      .catch(e => dispatch(removeMembersFailure(e)));
  };
}

function moveCardSuccess(data) {
  return {
    type: MOVE_CARD_SUCCESS,
    data
  };
}

function moveCardFailure(error) {
  return {
    type: MOVE_CARD_FAILURE,
    error
  };
}

export function moveCard(data) {
  return (dispatch) => {
    const { fromListId, toListId, cardId, orderNum } = data;
    const body = { fromListId, toListId, orderNum };

    sessionService.loadSession()
      .then(session => {
        return fetch(`/api/v1/cards/move/${ cardId }?token=${ session.token }`, {
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
        if (data.status === 200) {
          dispatch(moveCardSuccess(data));
        } else {
          dispatch(updateCardFailure(data));
        }
      })
      .catch(e => dispatch(moveCardFailure(e)));
  };
}
