import { createSlice } from "@reduxjs/toolkit";

export const sirenSlice = createSlice({
    name: 'siren',
    initialState: {
        isOn: false,
    },
    reducers: {
        sirenOn: (state) => {
            state.isOn = true;
        },
        sirenOff: (state) => {
            state.isOn = false;
        },
    }
});

export const { sirenOn, sirenOff } = sirenSlice.actions;

export default sirenSlice.reducer;