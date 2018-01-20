import * as Actions from '../actions/listActions';

const initialState = {
  isNewFormOpen: false,
  isFetching: false,
  error: null
};

const list = (state = initialState, action) => {
  switch (action.type) {
    case Actions.ADD_LIST_REQUEST:
      return {
        ...state,
        isFetching: true
      };
    case Actions.ADD_LIST_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isNewFormOpen: false
      };
    case Actions.ADD_LIST_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error.message
      };
    case Actions.TOGGLE_NEW_FORM:
      return {
        ...state,
        error: null,
        isNewFormOpen: !state.isNewFormOpen
      };
    default:
      return state;
  }
};

export default list;
