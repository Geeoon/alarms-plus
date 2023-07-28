import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { sirenOn, sirenOff } from '../Redux/Siren/sirenSlice';
import { useDispatch } from 'react-redux';

export default function NewAlarm(props) {
    const dispatch = useDispatch();
    return (
    <View style={styles.container}>
        <Button
            title="Create New Alarm"
            onPress={() => dispatch(sirenOn())}
        />
        <Button
            title="Create New Alarm"
            onPress={() => dispatch(sirenOff())}
        />
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

    text: {
        color: '#ffffff',
        fontSize: 15,
    },
});