import { combineReducers } from 'redux';
import { sessionReducer } from 'redux-react-session';
import sessionError from './sessionErrorReducer';

const reducers = {
  session: sessionReducer,
  sessionError
};

export const appReducer = combineReducers(reducers);
