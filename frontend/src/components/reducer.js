import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import GameList from './GameList/redux';

export default combineReducers({
  router: routerReducer,
  GameList,
});
