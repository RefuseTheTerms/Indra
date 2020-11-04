import { createStore, applyMiddleware } from 'redux';
import { persistCombineReducers } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import thunk from 'redux-thunk';

import reducer from './reducers'

//AsyncStorage.clear();

const persistConfig = {
    key: 'root',
    storage: AsyncStorage
};

const persistedReducer = persistCombineReducers(persistConfig, reducer);

const configureStore = () => {
    const store = createStore(
        persistedReducer,
        applyMiddleware(thunk)
    );

    return store;
}

export default configureStore;