import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

const dhms = (()=>{
    const SEC = 1e3;
    const MIN = SEC * 60;
    const HOUR = MIN * 60;
    const DAY = HOUR * 24;
    return time => {
        const ms = Math.abs(time);
        const d = ms / DAY | 0;
        const h = ms % DAY / HOUR | 0;
        const m = ms % HOUR / MIN | 0;
        const s = ms % MIN / SEC | 0;
        return `${time < 0 ? "-" : ""}${d}:${h}:${m}:${s}`;
    };
})();

export default function NextAlarm(props) {
    const alarmArray = useSelector((state) => state.alarms.alarms);
    const [currentTime, setCurrentTime] = useState(Date.now());
    const [timeTillNext, setTimeTillNext] = useState(null);

    useEffect(() => {
        const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
        return () => {
            clearInterval(interval);
        }
    });

    useEffect(() => {
        let time = null;
        for (let i = 0; i < alarmArray.length; i++) {
            if (alarmArray[i].date > currentTime) {
                time = alarmArray[i].date - currentTime;
                break;
            }
        }
        setTimeTillNext(time);
    }, [alarmArray, currentTime]);

    return (
    <View style={styles.container}>
        <Text style={styles.text}>{timeTillNext > 0 ? `Next Alarm in ${dhms(timeTillNext)}` : 'No Upcoming Alarms'}</Text>
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },

    text: {
        color: '#ffffff',
        fontSize: 30,
        fontWeight: 'bold',
    },
});