import { createSlice } from "@reduxjs/toolkit";

export const alarmsSlice = createSlice({
    name: 'alarms',
    initialState: {
        alarms: [],
        lastAlarmTime: -1,
    },
    reducers: {
        addAlarm: (state, action) => {
            let i = 0;
            while (i < state.alarms.length) {
                if (action.payload.date < state.alarms[i].date) {
                    break;
                }
                i++;
            }
            state.alarms.splice(i, 0, action.payload);
        },
        removeAlarm: (state, action) => {
            state.alarms = state.alarms.filter(alarm => alarm.name !== action.payload.name);
            // deactivate all alarms
            state.alarms = state.alarms.map((alarm) => {
                // reset all alarm activated status
                alarm.activated = null;
                return alarm;
            });
        },
        removeAlarmsBefore: (state, action) => {            
            state.alarms = state.alarms.filter(alarm => alarm.date >= action.payload.date);
            // deactivate all alarms
            state.alarms = state.alarms.map((alarm) => {
                // reset all alarm activated status
                alarm.activated = null;
                return alarm;
            });
        },
        setLastAlarmTime: (state, action) => {
            state.lastAlarmTime = action.payload;
        },
        setAlarmActivated: (state, action) => {
            state.alarms[action.payload.index].activated = action.payload.id;
        },
    }
});

export const { addAlarm, removeAlarm, removeAlarmsBefore, setLastAlarmTime, setAlarmActivated } = alarmsSlice.actions;

export default alarmsSlice.reducer;