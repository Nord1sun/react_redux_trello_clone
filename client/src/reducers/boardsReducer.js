import * as BoardActions from '../actions/boardActions';
import * as TitleActions from '../actions/boardTitleActions';
import * as ListActions from '../actions/listActions';

const initialState = {
  boards: [],
  isFetching: false,
  error: null
};

const boardData = (state = initialState, action) => {
  let boards, selectedBoard;
  switch (action.type) {
    case BoardActions.GET_BOARDS_REQUEST:
    case BoardActions.CREATE_BOARD_REQUEST:
    case BoardActions.DELETE_BOARD_REQUEST:
      return {
        ...state,
        isFetching: true
      };
    case BoardActions.GET_BOARDS_FAILURE:
    case BoardActions.CREATE_BOARD_FAILURE:
    case BoardActions.DELETE_BOARD_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error.message || action.error
      };
    case BoardActions.SELECT_BOARD:
      return {
        ...state,
        selectedBoard: state.boards.find(board => board.title === action.title),
        error: null
      };
    case BoardActions.GET_BOARDS_SUCCESS:
      return {
        ...state,
        boards: action.data.boards.sort((a, b) => a.title.localeCompare(b.title)),
        selectedBoard: action.data.boards[0],
        isFetching: false,
        error: null
      };
    case BoardActions.CREATE_BOARD_SUCCESS:
      return {
        ...state,
        isFetching: false,
        boards: [ ...state.boards, action.data.data ].sort((a, b) => a.title.localeCompare(b.title)),
        selectedBoard: action.data.data
      };
    case BoardActions.DELETE_BOARD_SUCCESS:
      boards = state.boards.filter(board => board.id !== action.data.board.id);
      return {
        ...state,
        boards: boards.sort((a, b) => a.title.localeCompare(b.title)),
        selectedBoard: boards[0],
        isFetching: false
      };
    case TitleActions.UPDATE_TITLE_SUCCESS:
      boards = state.boards.map(board => {
        return board.id === action.data.board.id ? action.data.board : board;
      });
      return {
        ...state,
        boards: boards.sort((a, b) => a.title.localeCompare(b.title)),
        selectedBoard: action.data.board
      };
    case ListActions.ADD_LIST_SUCCESS:
    case ListActions.UPDATE_LIST_SUCCESS:
    case ListActions.DELETE_LIST_SUCCESS:
      boards = action.data.boards.sort((a, b) => a.title.localeCompare(b.title));
      selectedBoard = boards.find(board => board.id === state.selectedBoard.id);
      return {
        ...state,
        boards,
        selectedBoard
      };
    default:
      return state;
  }
};

export default boardData;
