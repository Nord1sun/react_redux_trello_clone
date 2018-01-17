import { combineReducers } from 'redux';
import { sessionReducer } from 'redux-react-session';
import sessionError from './sessionErrorReducer';
import boardData from './boardsReducer';
import boardTitle from './boardTitleReducer';

const reducers = {
  session: sessionReducer,
  sessionError,
  boardData,
  boardTitle
};

export const appReducer = combineReducers(reducers);
