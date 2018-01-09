import { req } from '../../util/api';

export const LIST_START = 'gdq/gameList/LIST_START';
export const LIST_SUCCESS = 'gdq/gameList/LIST_SUCCESS';
export const LIST_WATCHED_START = 'gdq/gameList/LIST_WATCHED_START';
export const LIST_WATCHED_SUCCESS = 'gdq/gameList/LIST_WATCHED_SUCCESS';
export const ADD_WATCHED_START = 'gdq/gameList/ADD_WATCHED_START';
export const ADD_WATCHED_SUCCESS = 'gdq/gameList/ADD_WATCHED_SUCCESS';
export const REMOVE_WATCHED_START = 'gdq/gameList/REMOVE_WATCHED_START';
export const REMOVE_WATCHED_SUCCESS = 'gdq/gameList/REMOVE_WATCHED_SUCCESS';

const initialState = {
    loading: false,
    games: [],
    watchedGames: [],
  };

export default function reducer(state = initialState, action = {}) {
    switch(action.type) {
        case LIST_START:
        return {
            ...state,
            loading: true,
            games: [],
        };
        case LIST_SUCCESS:
        return {
            ...state,
            loading: false,
            games: action.games,
        };
        case LIST_WATCHED_START:
        return {
            ...state,
            loading: true,
            watchedGames: [],
        };
        case LIST_WATCHED_SUCCESS:
        case ADD_WATCHED_SUCCESS:
        case REMOVE_WATCHED_SUCCESS:
        return {
            ...state,
            loading: false,
            watchedGames: action.watchedGames,
        };
        default:
        return state;
    }
};

function loadGames() {
    return req('get', '/gamelist');
}

function loadWatchedGames() {
    return req('get', '/watchedgames');
}

function addWatchedGame(game) {
    return req('post', `/watchedgames/${game.id}`);
}

function removeWatchedGame(game) {
    return req('delete', `/watchedgames/${game.id}`);
}

export function load() {
    return dispatch => {
        dispatch({type: LIST_START});
        return loadGames().then(resp => {
            dispatch({type: LIST_SUCCESS, games: resp.data});
        });
    };
};

export function loadWatched() {
    return dispatch => {
        dispatch({type: LIST_WATCHED_START});
        return loadWatchedGames().then(resp => {
            dispatch({type: LIST_WATCHED_SUCCESS, watchedGames: resp.data});
        });
    };
};

export function addWatched(game) {
    return dispatch => {
        dispatch({type: ADD_WATCHED_START});
        return addWatchedGame(game).then(resp => {
            dispatch({type: ADD_WATCHED_SUCCESS, watchedGames: resp.data});
        });
    };
};

export function removeWatched(game) {
    return dispatch => {
        dispatch({type: REMOVE_WATCHED_START});
        return removeWatchedGame(game).then(resp => {
            dispatch({type: REMOVE_WATCHED_SUCCESS, watchedGames: resp.data});
        });
    };
};