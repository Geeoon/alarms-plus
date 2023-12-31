import { useState, useCallback, useEffect } from 'react';
import { Alert, StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import RNDateTimePicker from '@react-native-community/datetimepicker'

import { addAlarm } from '../Redux/Alarms/alarmsSlice';

export default function NewAlarmScreen({navigation}) {
  const alarmArray = useSelector((state) => state.alarms.alarms);
  const dispatch = useDispatch();
  
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date());
  const [repeats, setRepeats] = useState(5);
  const [repeatInterval, setRepeatInterval] = useState(5);

  const [pickerMode, setPickerMode] = useState('date');
  const [showPicker, setShowPicker] = useState(false);
  
  const createAlarm = useCallback(() => {
      if (date && repeats && repeatInterval && name) {
        if (alarmArray.findIndex((alarm) => alarm.name === name) === -1) {
          dispatch(addAlarm({
            name: name,
            date: date.getTime(),
            repeats: repeats,
            repeatInterval: repeatInterval,
            activated: null,
          }));
            Alert.alert('Alarm created.');
            navigation.navigate('Main');
        } else {
          Alert.alert('Alarm with same name already exists.');
        }
      } else {
        Alert.alert('Your alarm needs a name.');
      }
  }, [name, date, repeats, repeatInterval, alarmArray]);

  return (
    <View style={styles.container}>
        <View>
            <TextInput style={styles.textInput} placeholder='Alarm Name' placeholderTextColor='#999999' onChangeText={text => setName(text)}/>
            <View style={styles.inputContainer}>
                <Text style={styles.text}>Number of Repeats</Text>
                <TextInput
                  onChangeText={text => setRepeats(text)}
                  onEndEditing={(e) => setRepeats((e.nativeEvent.text != '') ? parseInt(e.nativeEvent.text) : 0)}
                  style={styles.numberInput}
                  inputMode='numeric'
                  placeholderTextColor='#999999'
                  value={'' + repeats}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.text}>Minutes Between Repeats</Text>
                <TextInput
                  onChangeText={text => setRepeatInterval(text)}
                  onEndEditing={(e) => setRepeatInterval((e.nativeEvent.text != '') ? parseInt(e.nativeEvent.text) : 1)}
                  style={styles.numberInput}
                  inputMode='numeric'
                  placeholderTextColor='#999999'
                  value={'' + repeatInterval}
                />
            </View>
            <View style={{backgroundColor: '#333333', margin: 10, padding: 5}}>
              <Text style={styles.text}>{date.toLocaleDateString([], {weekday: 'short', hour: '2-digit', minute:'2-digit'})}</Text>
              <View style={styles.changeContainer}>
                <View style={{margin: 5, flex: 1}} >
                  <Button title='Change Date' onPress={() => {
                    setPickerMode('date');
                    setShowPicker(true);
                  }}/>
                </View>
                <View style={{margin: 5, flex: 1}} >
                  <Button title='Change Time' onPress={() => {
                    setPickerMode('time');
                    setShowPicker(true);
                  }}/>
                </View>
              </View>
              {showPicker && <RNDateTimePicker 
                testID="dateTimePicker"
                value={date}
                mode={pickerMode}
                minimumDate={new Date()}
                onChange={(event, selectedDate) => {
                  setShowPicker(false);
                  setDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), selectedDate.getHours(), selectedDate.getMinutes(), 0, 0));
                }}
              />}
            </View>
        </View>
        <View style={styles.menuButtonContainer}>
            <View style={styles.menuButton}><Button title='Cancel' onPress={() => navigation.navigate('Main')}/></View>
            <View style={styles.menuButton}><Button title='Create Alarm' onPress={createAlarm}/></View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    flex: 1,
    backgroundColor: '#060606',
  },
  inputContainer: {
    flexDirection: 'row',
  },
  numberInput: {
    width: 50,
    color: 'white',
    backgroundColor: '#333333',
    fontSize: 20,
    padding: 4,
    margin: 5,
  },
  menuButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  menuButton: {
    margin: 5
  },
  textInput: {
    color: 'white',
    backgroundColor: '#333333',
    fontSize: 20,
    padding: 4,
    margin: 5,
  },
  text: {
    color: '#ffffff',
    fontSize: 20,
    alignSelf: 'center'
  },
  changeContainer: {
    flexDirection: 'row',
  },
});