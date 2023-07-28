import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { useDispatch } from 'react-redux';

export default function NewAlarm({navigation}) {
    const dispatch = useDispatch();
    return (
    <View style={styles.container}>
        <Button
            title="Create New Alarm"
            onPress={() => navigation.navigate('New Alarm')}
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