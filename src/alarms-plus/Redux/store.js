import { combineReducers, configureStore } from '@reduxjs/toolkit';
import sirenReducer from './Siren/sirenSlice';
import alarmsReducer from './Alarms/alarmsSlice';
import ignoresReducer from './Ignores/ignoresSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER
} from 'redux-persist';

const reducers = combineReducers({
    siren: sirenReducer,
    alarms: alarmsReducer,
    ignores: ignoresReducer,
});

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
}

const persistedReducer = persistReducer(persistConfig, reducers);

export default configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});