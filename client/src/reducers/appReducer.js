import { combineReducers } from 'redux';
import { sessionReducer } from 'redux-react-session';
import sessionError from './sessionErrorReducer';
import boardData from './boardsReducer';
import boardTitle from './boardTitleReducer';
import { USER_LOGOUT } from '../actions/sessionActions';

const reducers = {
  session: sessionReducer,
  sessionError,
  boardData,
  boardTitle
};

const appReducer = combineReducers(reducers);

export const djello = (state, action) => {
  if (action.type === USER_LOGOUT) {
    const { session } = state;
    state = { session };
  }

  return appReducer(state, action);
};
