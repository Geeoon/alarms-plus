import { createSlice } from "@reduxjs/toolkit";

export const alarmsSlice = createSlice({
    name: 'alarms',
    initialState: {
        alarms: []
    },
    reducers: {
        addAlarm: (state, action) => {
            state.alarms = [...state.alarms, action.payload];
        },
        removeAlarm: (state, action) => {
            state.alarms = state.alarms.filter(alarm => alarm.name !== action.payload.name);
        },
        removeAlarmsBefore: (state, action) => {
            state.alarms = state.alarms.filter(alarm => alarm.date >= action.payload.date);
        },
    }
});

export const { addAlarm, removeAlarm, removeAlarmsBefore } = alarmsSlice.actions;

export default alarmsSlice.reducer;