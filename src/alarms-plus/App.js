import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import NextAlarm from './components/NextAlarm';

export default function App() {
  return (
    <View style={styles.container}>
      <NextAlarm />
      <View>
        <Text style={styles.text}>Create New Alarm</Text>
      </View>
      <Text style={styles.text}>Alarms Here</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#010101',
  },
  text: {
    color: '#ffffff',
  },
});
