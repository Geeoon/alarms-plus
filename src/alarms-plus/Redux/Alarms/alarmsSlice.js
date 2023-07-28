import { createSlice } from "@reduxjs/toolkit";

export const alarmsSlice = createSlice({
    name: 'alarms',
    initialState: {
        alarms: []
    },
    reducers: {
        addAlarm: (state, action) => {
            if (state.alarms.findIndex(alarm => alarm.name === action.name) === -1) {
                state.alarms = [...state.alarms, action.alarm];
            }
        },
        removeAlarm: (state, action) => {
            state.alarms = state.alarms.filter(alarm => alarm.name !== action.name);
        },
    }
});

export const { addAlarm, removeAlarm } = alarmsSlice.actions;

export default alarmsSlice.reducer;