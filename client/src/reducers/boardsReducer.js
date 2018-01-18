import * as Actions from '../actions/boardActions';
import * as TitleActions from '../actions/boardTitleActions';

const initialState = {
  boards: [],
  isFetching: false,
  error: null
};

const boardData = (state = initialState, action) => {
  let boards;
  switch (action.type) {
    case Actions.GET_BOARDS_REQUEST:
    case Actions.CREATE_BOARD_REQUEST:
    case Actions.DELETE_BOARD_REQUEST:
      return {
        ...state,
        isFetching: true
      };
    case Actions.GET_BOARDS_FAILURE:
    case Actions.CREATE_BOARD_FAILURE:
    case Actions.DELETE_BOARD_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error.message || action.error
      };
    case Actions.SELECT_BOARD:
      return {
        ...state,
        selectedBoard: state.boards.find(board => board.title === action.title),
        error: null
      };
    case Actions.GET_BOARDS_SUCCESS:
      return {
        ...state,
        boards: action.data.boards.sort((a, b) => a.title.localeCompare(b.title)),
        selectedBoard: action.data.boards[0],
        isFetching: false,
        error: null
      };
    case Actions.CREATE_BOARD_SUCCESS:
      return {
        ...state,
        isFetching: false,
        boards: [ ...state.boards, action.data.data ].sort((a, b) => a.title.localeCompare(b.title)),
        selectedBoard: action.data.data
      };
    case Actions.DELETE_BOARD_SUCCESS:
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
    default:
      return state;
  }
};

export default boardData;
