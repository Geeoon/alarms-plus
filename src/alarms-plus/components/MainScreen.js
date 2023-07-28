import { Alert, StyleSheet, Text, View } from 'react-native';

import NextAlarm from './NextAlarm';
import NewAlarm from './NewAlarm';
import AlarmList from './AlarmList';

export default function MainScreen({navigation}) {
  return (
    <View style={styles.container}>
      <NextAlarm time={1900} />
      <NewAlarm navigation={navigation} />
      <AlarmList alarms={[]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    flex: 1,
    backgroundColor: '#060606',
  },
  text: {
    color: '#ffffff',
  },
});