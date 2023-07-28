import { useState, useCallback } from 'react';
import { Alert, StyleSheet, Text, View, Button, TextInput } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';

export default function NewAlarmScreen({navigation}) {
    const [date, setDate] = useState(new Date());
    const [repeats, setRepeats] = useState(5);
    const [repeatInterval, setRepeatInterval] = useState(5);
    const [name, setName] = useState('');

    const createAlarm = useCallback(() => {
        if (date && repeats && repeatInterval && name) {
            // add time to date
            // add to store
            Alert.alert('Alarm created.');
            navigation.navigate('Main');
        } else {
            Alert.alert('Your alarm needs a name.');
        }
    }, [date, repeats, repeatInterval, name]);

  return (
    <View style={styles.container}>
        <View>
            <TextInput style={styles.textInput} placeholder='Alarm Name' placeholderTextColor='#999999' onChangeText={text => setName(text)}/>
            <View style={styles.inputContainer}>
                <Text style={styles.text}>Number of Repeats</Text>
                <TextInput onChangeText={text => setRepeats((text != '') ? parseInt(text) : 0)} style={styles.numberInput} inputMode='numeric' placeholderTextColor='#999999' value={'' + repeats}/>
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.text}>Minutes Between Repeats</Text>
                <TextInput onChangeText={text => setRepeatInterval((text != '') ? parseInt(text) : 1)} style={styles.numberInput} inputMode='numeric' placeholderTextColor='#999999' value={'' + repeatInterval}/>
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