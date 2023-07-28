import { configureStore } from '@reduxjs/toolkit';
import sirenReducer from './Siren/sirenSlice';
import alarmsReducer from './Alarms/alarmsSlice';

export default configureStore({
    reducer: {
        siren: sirenReducer,
        alarms: alarmsReducer,
    },
});