import { apiRequest } from '../helpers/fetchHelper';

export const GET_BOARDS_REQUEST = 'GET_BOARDS_REQUEST';
export const GET_BOARDS_SUCCESS = 'GET_BOARDS_SUCCESS';
export const GET_BOARDS_FAILURE = 'GET_BOARDS_FAILURE';
export const SELECT_BOARD = 'SELECT_BOARD';
export const DELETE_BOARD_REQUEST = 'DELETE_BOARD_REQUEST';
export const DELETE_BOARD_SUCCESS = 'DELETE_BOARD_SUCCESS';
export const DELETE_BOARD_FAILURE = 'DELETE_BOARD_FAILURE';
export const CREATE_BOARD_REQUEST = 'CREATE_BOARD_REQUEST';
export const CREATE_BOARD_SUCCESS = 'CREATE_BOARD_SUCCESS';
export const CREATE_BOARD_FAILURE = 'CREATE_BOARD_FAILURE';

function getBoardsSuccess(data) {
  return {
    type: GET_BOARDS_SUCCESS,
    data
  };
}

function getBoardsFailure(error) {
  return {
    type: GET_BOARDS_FAILURE,
    error
  };
}

export function getBoards() {
  return (dispatch) => {
    dispatch({ type: GET_BOARDS_REQUEST });

    apiRequest({
      url: '/api/v1/boards',
      method: 'GET',
      onSuccess: getBoardsSuccess,
      onFail: getBoardsFailure,
      dispatch
    });
  };
}

export function selectBoard(title) {
  return {
    type: SELECT_BOARD,
    title
  };
}

function deleteBoardsSuccess(data) {
  return {
    type: DELETE_BOARD_SUCCESS,
    data
  };
}

function deleteBoardsFailure(error) {
  return {
    type: DELETE_BOARD_FAILURE,
    error
  };
}

export function deleteBoard(id) {
  return (dispatch) => {
    dispatch({ type: DELETE_BOARD_REQUEST });

    apiRequest({
      url: `/api/v1/boards/${ id }`,
      method: 'DELETE',
      onSuccess: deleteBoardsSuccess,
      onFail: deleteBoardsFailure,
      dispatch
    });
  };
}

function createBoardsSuccess(data) {
  return {
    type: CREATE_BOARD_SUCCESS,
    data
  };
}

function createBoardsFailure(error) {
  return {
    type: CREATE_BOARD_FAILURE,
    error
  };
}

export function createBoard() {
  return (dispatch) => {
    dispatch({ type: CREATE_BOARD_REQUEST });

    apiRequest({
      url: '/api/v1/boards',
      method: 'POST',
      onSuccess: createBoardsSuccess,
      onFail: createBoardsFailure,
      dispatch
    });
  };
}
