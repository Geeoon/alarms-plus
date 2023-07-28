import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import NextAlarm from './components/NextAlarm';
import NewAlarm from './components/NewAlarm';
import AlarmList from './components/AlarmList';

export default function App() {
  return (
    <View style={styles.container}>
      <NextAlarm time={100} />
      <NewAlarm />
      <AlarmList />
      <StatusBar style="light"/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    flex: 1,
    backgroundColor: '#010101',
  },
  text: {
    color: '#ffffff',
  },
});
