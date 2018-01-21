import * as Actions from '../actions/cardActions';

const initialState = {
  isFetching: false,
  error: null
};

const card = (state = initialState, action) => {
  switch (action.type) {
    case Actions.UPDATE_CARD_REQUEST:
    case Actions.DELETE_CARD_REQUEST:
      return {
        ...state,
        isFetching: true
      };
    case Actions.UPDATE_CARD_SUCCESS:
    case Actions.DELETE_CARD_SUCCESS:
      return {
        ...state,
        isFetching: false,
        error: null
      };
    case Actions.UPDATE_CARD_FAILURE:
    case Actions.DELETE_CARD_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error.message
      };
    default:
      return state;
  }
};

export default card;
