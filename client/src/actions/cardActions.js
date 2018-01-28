import { apiRequest } from '../helpers/fetchHelper';

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

    apiRequest({
      url: '/api/v1/cards',
      method: 'POST',
      body,
      onSuccess: addCardSuccess,
      onFail: addCardFailure,
      dispatch
    });
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

    apiRequest({
      url: `/api/v1/cards/${ card.id }`,
      method: 'PUT',
      body,
      onSuccess: updateCardSuccess,
      onFail: updateCardFailure,
      dispatch
    });
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

    apiRequest({
      url: `/api/v1/cards/${ id }`,
      method: 'DELETE',
      onSuccess: deleteCardSuccess,
      onFail: deleteCardFailure,
      dispatch
    });
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

    apiRequest({
      url: `/api/v1/cards/${ id }/search_non_members/?term=${ encodeURIComponent(term) }`,
      method: 'GET',
      onSuccess: searchNonMembersSuccess,
      onFail: searchNonMembersFailure,
      dispatch
    });
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

    apiRequest({
      url: `/api/v1/cards/${ cardId }/add_member/${ userId }`,
      method: 'POST',
      onSuccess: addMembersSuccess,
      onFail: addMembersFailure,
      dispatch
    });
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

    apiRequest({
      url: `/api/v1/cards/${ cardId }/remove_member/${ userId }`,
      method: 'DELETE',
      onSuccess: removeMembersSuccess,
      onFail: removeMembersFailure,
      dispatch
    });
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

    apiRequest({
      url: `/api/v1/cards/move/${ cardId }`,
      method: 'PUT',
      body,
      onSuccess: moveCardSuccess,
      onFail: moveCardFailure,
      dispatch
    });
  };
}
