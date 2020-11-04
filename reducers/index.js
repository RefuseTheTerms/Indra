import { combineReducers } from 'redux';

import user from './userState.js';

const rootReducer = combineReducers({
    user
});

export default {
    reducer: rootReducer
}