import React from 'react';
import { StyleSheet, ScrollView, Text } from 'react-native';
import { useSelector } from 'react-redux';

import Alarm from './Alarm';

export default function AlarmList(props) {
    const alarmArray = useSelector((state) => state.alarms.alarms);
    return (
    <ScrollView style={styles.container}>
        {(alarmArray && alarmArray.length > 0) ? alarmArray.map(alarm => <Alarm key={alarm.name} name={alarm.name} />) : <Text style={styles.text}>No Alarms.</Text>}
    </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexGrow: 60,
        padding: 5
    },

    text: {
        color: '#ffffff',
        fontSize: 25,
    },
});