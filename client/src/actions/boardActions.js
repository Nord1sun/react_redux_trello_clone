import { checkStatus } from '../helpers/fetchHelper';
import { sessionService } from 'redux-react-session';

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

export function getBoardsRequest() {
  return { type: GET_BOARDS_REQUEST };
}

export function getBoardsSuccess(data) {
  return {
    type: GET_BOARDS_SUCCESS,
    data
  };
}

export function getBoardsFailure(error) {
  return {
    type: GET_BOARDS_FAILURE,
    error
  };
}

export function getBoards(userId) {
  return (dispatch) => {
    dispatch(getBoardsRequest());

    fetch(`/api/v1/boards/${ userId }`)
      .then(checkStatus)
      .then(boards => {
        dispatch(getBoardsSuccess(boards));
      })
      .catch(() => {
        dispatch(getBoardsFailure({ message: 'Could not fetch boards' }));
      });
  };
}

export function selectBoard(title) {
  return {
    type: SELECT_BOARD,
    title
  };
}

export function deleteBoardsSuccess(data) {
  return {
    type: DELETE_BOARD_SUCCESS,
    data
  };
}

export function deleteBoardsFailure(error) {
  return {
    type: DELETE_BOARD_FAILURE,
    error
  };
}

export function deleteBoard(id) {
  return (dispatch) => {
    dispatch({ type: DELETE_BOARD_REQUEST });

    sessionService.loadSession()
      .then(session => {
        return fetch(`/api/v1/boards/${ id }?token=${ session.token }`, {
          method: 'DELETE'
        });
      })
      .then(checkStatus)
      .then(boardData => {
        if (boardData.status === 200) {
          dispatch(deleteBoardsSuccess(boardData));
        } else {
          dispatch(deleteBoardsFailure(boardData));
        }
      })
      .catch(e => dispatch(deleteBoardsFailure(e)));
  };
}

export function createBoardsSuccess(data) {
  return {
    type: CREATE_BOARD_SUCCESS,
    data
  };
}

export function createBoardsFailure(error) {
  return {
    type: CREATE_BOARD_FAILURE,
    error
  };
}

export function createBoard() {
  return (dispatch) => {
    dispatch({ type: CREATE_BOARD_REQUEST });

    sessionService.loadSession()
      .then(session => {
        return fetch(`/api/v1/boards?token=${ session.token }`, {
          method: 'POST'
        });
      })
      .then(checkStatus)
      .then(boardData => {
        if (boardData.status === 200) {
          dispatch(createBoardsSuccess(boardData));
        } else {
          dispatch(createBoardsFailure(boardData));
        }
      })
      .catch(e => dispatch(createBoardsFailure(e)));
  };
}

