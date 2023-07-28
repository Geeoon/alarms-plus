import { configureStore } from '@reduxjs/toolkit';
import sirenReducer from './Siren/sirenSlice';

export default configureStore({
    reducer: {
        siren: sirenReducer,
    },
});