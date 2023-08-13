import { createSlice } from "@reduxjs/toolkit";

export const ignoresSlice = createSlice({
    name: 'ignores',
    initialState: {
        ignoreBattery: false,
    },
    reducers: {
        toggleIgnoreBattery: (state) => {
            state.ignoreBattery = !state.ignoreBattery;
        }
    }
});

export const { toggleIgnoreBattery } = ignoresSlice.actions;

export default ignoresSlice.reducer;