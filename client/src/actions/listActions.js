import { apiRequest } from '../helpers/fetchHelper';

export const ADD_LIST_REQUEST = 'ADD_LIST_REQUEST';
export const ADD_LIST_SUCCESS = 'ADD_LIST_SUCCESS';
export const ADD_LIST_FAILURE = 'ADD_LIST_FAILURE';
export const TOGGLE_NEW_FORM = 'TOGGLE_NEW_FORM';
export const UPDATE_LIST_REQUEST = 'UPDATE_LIST_REQUEST';
export const UPDATE_LIST_SUCCESS = 'UPDATE_LIST_SUCCESS';
export const UPDATE_LIST_FAILURE = 'UPDATE_LIST_FAILURE';
export const DELETE_LIST_REQUEST = 'DELETE_LIST_REQUEST';
export const DELETE_LIST_SUCCESS = 'DELETE_LIST_SUCCESS';
export const DELETE_LIST_FAILURE = 'DELETE_LIST_FAILURE';
export const REORDER_LISTS_REQUEST = 'REORDER_LISTS_REQUEST';
export const REORDER_LISTS_SUCCESS = 'REORDER_LISTS_SUCCESS';
export const REORDER_LISTS_FAILURE = 'REORDER_LISTS_FAILURE';

function addListSuccess(data) {
  return {
    type: ADD_LIST_SUCCESS,
    data
  };
}

function addListFailure(error) {
  return {
    type: ADD_LIST_FAILURE,
    error
  };
}

export function addNewList(listData) {
  return (dispatch) => {
    dispatch({ type: ADD_LIST_REQUEST });

    apiRequest({
      url: '/api/v1/lists',
      method: 'POST',
      body: listData,
      onSuccess: addListSuccess,
      onFail: addListFailure,
      dispatch
    });
  };
}

export function toggleNewListForm() {
  return { type: TOGGLE_NEW_FORM };
}


function updateListSuccess(data) {
  return {
    type: UPDATE_LIST_SUCCESS,
    data
  };
}

function updateListFailure(error) {
  return {
    type: UPDATE_LIST_FAILURE,
    error
  };
}

export function updateTitle(id, title) {
  return (dispatch) => {
    dispatch({ type: UPDATE_LIST_REQUEST });

    apiRequest({
      url: `/api/v1/lists/${ id }`,
      method: 'PUT',
      body: { title },
      onSuccess: updateListSuccess,
      onFail: updateListFailure,
      dispatch
    });
  };
}

function deleteListSuccess(data) {
  return {
    type: DELETE_LIST_SUCCESS,
    data
  };
}

function deleteListFailure(error) {
  return {
    type: DELETE_LIST_FAILURE,
    error
  };
}

export function deleteList(listId) {
  return (dispatch) => {
    dispatch({ type: DELETE_LIST_REQUEST });

    apiRequest({
      url: `/api/v1/lists/${ listId }`,
      method: 'DELETE',
      onSuccess: deleteListSuccess,
      onFail: deleteListFailure,
      dispatch
    });
  };
}

function reorderListsSuccess(data) {
  return {
    type: REORDER_LISTS_SUCCESS,
    data
  };
}

function reorderListsFailure(error) {
  return {
    type: REORDER_LISTS_FAILURE,
    error
  };
}

export function reorderLists(listInfo) {
  return (dispatch) => {
    dispatch({ type: REORDER_LISTS_REQUEST });

    const { boardId, listId, orderNum } = listInfo;
    apiRequest({
      url: `/api/v1/lists/reorder/${ boardId }/${ listId }/${ orderNum }`,
      method: 'POST',
      onSuccess: reorderListsSuccess,
      onFail: reorderListsFailure,
      dispatch
    });
  };
}
