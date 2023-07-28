import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

export default function NextAlarm(props) {
    const sirenOn = useSelector((state) => state.siren.isOn);
    return (
    <View style={styles.container}>
        <Text style={styles.text}>Next Alarm In {props.time} Siren status: { sirenOn ? "On" : "Off"}</Text>
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