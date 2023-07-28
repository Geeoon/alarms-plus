import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Alarm(props) {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{props.name}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#333333',
        borderRadius: 5,
        padding: 5,
        margin: 5,
    },

    text: {
        color: '#ffffff',
        fontSize: 20,
    },
});