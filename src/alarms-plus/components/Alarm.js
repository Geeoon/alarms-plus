import React, { useCallback } from 'react';
import { Button, StyleSheet, Text, View, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import * as Notifications from 'expo-notifications';

import { removeAlarm } from '../Redux/Alarms/alarmsSlice';

export default function Alarm(props) {
    const dispatch = useDispatch();
    const onDelete = useCallback(() => {
        Alert.alert(`Delete "${props.name}" Alarm`, 'Are you sure you want to delete this alarm?', [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'YES',
                onPress: async () => {
                    // reset all scheduled notifications
                    await Notifications.cancelAllScheduledNotificationsAsync();
                    dispatch(removeAlarm({ name: props.name }));
                 },
            },
        ]);
    }, [props.name]);

    return (
        <View style={styles.container}>
            <View style={styles.info}>
                <Text style={styles.name}>{props.name}</Text>{Date.now() > props.date && <Text style={styles.past}>Past Alarm</Text>}
                <Text style={styles.date}>{new Date(props.date).toLocaleDateString([], {weekday: 'short', hour: '2-digit', minute:'2-digit'})}</Text>
            </View>
            <Button title='DELETE' onPress={onDelete}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333333',
        borderRadius: 5,
        padding: 5,
        margin: 5,
    },

    past: {
        color: 'red',
        fontSize: 25,
    },

    info: {
        flex: 1,
    },
    
    name: {
        color: '#ffffff',
        fontSize: 20,
    },

    date: {
        color: '#ffffff',
    },
});