import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import Alarm from './Alarm';

export default function AlarmList(props) {
    return (
    <ScrollView style={styles.container}>
        <Alarm time={9999999}/>
    </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexGrow: 60,
    },

    text: {
        color: '#ffffff',
        fontSize: 20,
    },
});