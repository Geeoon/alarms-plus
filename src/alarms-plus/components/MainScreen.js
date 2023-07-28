import { Alert, StyleSheet, Text, View } from 'react-native';

import NextAlarm from './NextAlarm';
import NewAlarm from './NewAlarm';
import AlarmList from './AlarmList';

export default function MainScreen() {
  return (
    <View style={styles.container}>
      <NextAlarm time={1900} />
      <NewAlarm />
      <AlarmList alarms={[]} />
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