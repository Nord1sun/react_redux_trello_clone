import { SET_SESSION_ERROR, REMOVE_SESSION_ERROR } from '../actions/sessionActions';

const sessionInfo = (state = {}, action) => {
  switch (action.type) {
    case SET_SESSION_ERROR:
      return {
        ...state,
        message: action.error.message
      };
    case REMOVE_SESSION_ERROR:
      return {
        ...state,
        message: null
      };
    default:
      return state;
  }
};

export default sessionInfo;
