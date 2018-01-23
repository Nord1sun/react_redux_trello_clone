import * as Actions from '../actions/cardActions';

const initialState = {
  isFetching: false,
  error: null,
  userSearchResults: []
};

const card = (state = initialState, action) => {
  switch (action.type) {
    case Actions.UPDATE_CARD_REQUEST:
    case Actions.DELETE_CARD_REQUEST:
    case Actions.ADD_CARD_REQUEST:
    case Actions.SEARCH_NONMEMBER_REQUEST:
    case Actions.ADD_MEMBER_REQUEST:
    case Actions.REMOVE_MEMBER_REQUEST:
      return {
        ...state,
        isFetching: true,
        userSearchResults: []
      };
    case Actions.UPDATE_CARD_SUCCESS:
    case Actions.DELETE_CARD_SUCCESS:
    case Actions.ADD_CARD_SUCCESS:
    case Actions.ADD_MEMBER_SUCCESS:
    case Actions.REMOVE_MEMBER_SUCCESS:
      return {
        ...state,
        isFetching: false,
        error: null
      };
    case Actions.UPDATE_CARD_FAILURE:
    case Actions.DELETE_CARD_FAILURE:
    case Actions.ADD_CARD_FAILURE:
    case Actions.SEARCH_NONMEMBER_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error.message,
        userSearchResults: []
      };
    case Actions.ADD_MEMBER_FAILURE:
    case Actions.REMOVE_MEMBER_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error.message
      };
    case Actions.SEARCH_NONMEMBER_SUCCESS:
      return {
        ...state,
        isFetching: false,
        error: null,
        userSearchResults: action.data.users
      };
    default:
      return state;
  }
};

export default card;
