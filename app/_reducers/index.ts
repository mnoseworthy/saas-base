import { combineReducers } from 'redux';

import { auth } from './User';


const rootReducer = combineReducers({
  auth
});

export default rootReducer;