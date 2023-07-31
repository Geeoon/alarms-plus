import { createSlice } from "@reduxjs/toolkit";

export const sirenSlice = createSlice({
    name: 'siren',
    initialState: {
        isOn: false,
        alarmName: null,
        alarmDate: 0,
    },
    reducers: {
        sirenOn: (state, action) => {
            state.isOn = true;
            state.alarmName = action.payload.name;
            state.alarmDate = action.payload.date;
        },
        sirenOff: (state) => {
            state.isOn = false;
        },
    }
});

export const { sirenOn, sirenOff } = sirenSlice.actions;

export default sirenSlice.reducer;