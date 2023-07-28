import { useState, useCallback, useEffect } from 'react';
import { Alert, StyleSheet, Text, View, Button, TextInput } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { useDispatch, useSelector } from 'react-redux';
import { SelectList } from 'react-native-dropdown-select-list';

import { addAlarm } from '../Redux/Alarms/alarmsSlice';

export default function NewAlarmScreen({navigation}) {
  const alarmArray = useSelector((state) => state.alarms.alarms);
  const dispatch = useDispatch();
  
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date());
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [repeats, setRepeats] = useState(5);
  const [repeatInterval, setRepeatInterval] = useState(5);

  const createAlarm = useCallback(() => {
      if (date && repeats && repeatInterval && name) {
        if (alarmArray.findIndex((alarm) => alarm.name === name) === -1) {
          Alert.alert('Alarm created.');
          // TODO: add time to date
          dispatch(addAlarm({
              name: name,
              date: date.getTime(),
              repeats: repeats,
              repeatInterval: repeatInterval,
          }));
            navigation.navigate('Main');
        } else {
          Alert.alert('Alarm with same name already exists.');
        }
      } else {
        Alert.alert('Your alarm needs a name.');
      }
  }, [name, date, repeats, repeatInterval, alarmArray]);

  useEffect(() => {
    // set hours, minutes to current date
    setHours(parseInt((date.getHours() >= 0) ? ((date.getHours() % 12) === 0 ? 12 : date.getHours() % 12) : 12));
    setMinutes(date.getMinutes());
  }, []);

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
            <View style={styles.inputContainer}>
              <Text style={styles.text}>Time: </Text>
              <TextInput
                onChangeText={text => setHours(text)}
                onEndEditing={(text) => {
                  if (text != '') {
                    if (hours < 1) {
                      setDate(new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, date.getMinutes(), date.getMilliseconds()));
                    } else if (hours > 23) {
                      setDate(new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours % 24, date.getMinutes(), date.getMilliseconds()));
                    } else {
                      setDate(new Date(date.getFullYear(), date.getMonth(), date.getDate(), parseInt(hours), date.getMinutes(), date.getMilliseconds()));
                    }
                  } else {
                    setDate(new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, date.getMinutes(), date.getMilliseconds()));
                  }
                  setHours(parseInt((hours >= 0) ? ((hours % 12) === 0 ? 12 : hours % 12) : 12));
                }}
                style={styles.numberInput}
                inputMode='numeric'
                value={'' + hours}
              />
              <Text style={styles.text}>:</Text>
              <TextInput
                onChangeText={text => setMinutes(text)}
                onEndEditing={(text) => {
                  if (text != '') {
                    if (minutes < 0) {
                      setDate(new Date(dathourse.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), 0, date.getMilliseconds()));
                    } else if (hours >= 60) {
                      setDate(new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), minutes % 60, date.getMilliseconds()));
                    } else {
                      setDate(new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), parseInt(minutes), date.getMilliseconds()));
                    }
                  } else {
                    setDate(new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), 0, date.getMilliseconds()));
                  }
                  setMinutes(parseInt((minutes >= 0) ? ((minutes < 60) ? minutes : 59) : 0));
                }}
                style={styles.numberInput}
                inputMode='numeric'
                value={'' + minutes}
              />
              <Button title={date.getHours() > 11 ? "PM" : "AM"} onPress={() => {date.getHours() >= 12 ?
                setDate(new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours() - 12, date.getMinutes(), date.getMilliseconds())) : 
                setDate(new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours() + 12, date.getMinutes(), date.getMilliseconds()))
              }}/>
              <Text style={styles.text}>{date.getHours()}</Text>
            </View>
            <View style={{backgroundColor: '#333333', margin: 10}}>
                <CalendarPicker 
                    minDate={new Date()}
                    disabledDatesTextStyle={{color: '#484848'}}
                    textStyle={{color: 'white'}}
                    todayBackgroundColor='rgba(0,0,0,0)'
                    todayTextStyle={{color: 'white'}}
                    selectedDayColor='#ccc'
                    onDateChange={(date, type) => {setDate(date)}}
                />
                <Text>{date && date.toString()}</Text>
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
});