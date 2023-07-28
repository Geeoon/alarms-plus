import React from 'react';
import { Alert, StyleSheet, Text, View, Button } from 'react-native';

export default function NewAlarm(props) {
    return (
    <View style={styles.container}>
        <Button
            title="Create New Alarm"
            onPress={() => Alert.alert('new alarm screen')}
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