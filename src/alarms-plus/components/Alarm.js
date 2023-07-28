import React, { useCallback } from 'react';
import { Button, StyleSheet, Text, View, Alert } from 'react-native';
import { useDispatch } from 'react-redux';

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
                onPress: () => { dispatch(removeAlarm({ name: props.name })) },
            },
        ]);
    }, [props.name]);

    return (
        <View style={styles.container}>
            <View style={styles.info}>
                <Text style={styles.name}>{props.name}</Text>
                <Text style={styles.date}>{new Date(props.date).toLocaleString('en-US', { weekday: 'short' })}</Text>
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