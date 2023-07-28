import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function NextAlarm() {
    return (
    <View style={styles.container}>
        <Text style={styles.text}>Next Alarm In ...</Text>
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 30,
        alignItems: 'center',
    },

    text: {
        color: '#ffffff',
        fontSize: 30,
        fontWeight: 'bold',
    },
});