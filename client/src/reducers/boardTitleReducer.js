import * as Actions from '../actions/boardTitleActions';

const initialState = {
  isFormVisable: false,
  isFetching: false,
  error: null
};

const boardTitle = (state = initialState, action) => {
  switch (action.type) {
    case Actions.TOGGLE_FORM_VISABILITY:
      return {
        ...state,
        isFormVisable: !state.isFormVisable,
        error: null
      };
    case Actions.UPDATE_TITLE_REQUEST:
      return {
        ...state,
        isFetching: true
      };
    case Actions.UPDATE_TITLE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isFormVisable: false
      };
    case Actions.UPDATE_TITLE_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error.message
      };
    default:
      return state;
  }
};

export default boardTitle;
