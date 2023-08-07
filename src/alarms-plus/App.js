import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform, View } from 'react-native';
import { useEffect, createRef, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { sirenOn } from './Redux/Siren/sirenSlice';
import { setAlarmActivated, setCalendarId } from './Redux/Alarms/alarmsSlice';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import * as Calendar from 'expo-calendar';

// purge expo-task-manager
// purge expo-notifications
// purge expo-device

import MainScreen from './components/MainScreen';
import NewAlarmScreen from './components/NewAlarmScreen';
import SirenScreen from './components/SirenScreen';
import store from './Redux/store';

const CALENDAR_TITLE = 'Alarms Plus: Upcoming Alarms';
const CALENDAR_NAME = 'alarmsPlusCalendar';

const Stack = createNativeStackNavigator();

async function checkAlarms() { // call this every second to check for alarms
  let lastAlarmDate = store.getState().siren.alarmDate;
  let alarmArray = store.getState().alarms.alarms;

  for (let i = 0; i < alarmArray.length; i++) {
    if (alarmArray[i].activated === null) {

      // schedule event here
      let eventAlarms = [];
      for (let j = 1; j <= alarmArray[i].repeats; j++) {
        eventAlarms = [...eventAlarms, {
          method: Calendar.AlarmMethod.ALARM,
          relativeOffset: j * alarmArray[i].repeatInterval,
        }];
      }
      let eventId = await Calendar.createEventAsync(store.getState().alarms.calendarId, {
        alarms: eventAlarms,
        startDate: new Date(alarmArray[i].date),
        endDate: new Date(alarmArray[i].date + ((alarmArray[i].repeats + 1) * alarmArray[i].repeatInterval * 60) * 1000),
        title: alarmArray[i].name,
      });
      console.log('scheduled event for T-' + Math.trunc((alarmArray[i].date - Date.now()) / 1000) + ' seconds');
      store.dispatch(setAlarmActivated({ index: i, id: eventId, }));
    }
    if (alarmArray[i].date > lastAlarmDate) {
      if (alarmArray[i].date < Date.now()) {
        store.dispatch(sirenOn({ name: alarmArray[i].name, date: alarmArray[i].date }));
        store.dispatch(setAlarmActivated({ index: i, id: null, }));
        break;
      }
    }
  }
}

async function getDefaultCalendarSource() {
  const defaultCalendar = await Calendar.getDefaultCalendarAsync();
  return defaultCalendar.source;
}

async function createCalendar() {
  const defaultCalendarSource =
    Platform.OS === 'ios'
      ? await getDefaultCalendarSource()
      : { isLocalAccount: true, name: CALENDAR_TITLE };
  const newCalendarID = await Calendar.createCalendarAsync({
    title: CALENDAR_TITLE,
    color: 'white',
    entityType: Calendar.EntityTypes.EVENT,
    sourceId: defaultCalendarSource.id,
    source: defaultCalendarSource,
    name: CALENDAR_NAME,
    ownerAccount: 'personal',
    accessLevel: Calendar.CalendarAccessLevel.OWNER,
  });
  return newCalendarID;
}

export default function App() {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const isSirenOn = useSelector((state) => state.siren.isOn);
  const navRef = createRef();

  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === 'granted') {
        let globalCalendars = (await Calendar.getCalendarsAsync()).map((c) => {
          return { id: c.id, name: c.name };
        });

        let calendar = globalCalendars.find(calendar => calendar.name === CALENDAR_NAME);
        if (!calendar) {
          let calId = await createCalendar();
          store.dispatch(setCalendarId({ id: calId }));
          console.log('created calendar, id: ' + calId);
        } else {
          store.dispatch(setCalendarId({ id: calendar.id }));
        }
      } else {
        alert("You must allow this app to access the device calendar in order to get alarms!");
      }
    })();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => {
      clearInterval(interval);
    }
  }, []);

  useEffect(() => {  // updates every second
    checkAlarms();
  }, [currentTime]);


  useEffect(() => {
    if (navRef.current) {
      if (isSirenOn) {
        navRef.current?.navigate('Siren On');
      } else {
        navRef.current?.navigate('Main');
      }
    }
  }, [isSirenOn]);

  return (
    <NavigationContainer ref={navRef}>
      <View style={{flex: 1, backgroundColor: '#060606'}}>
        <Stack.Navigator
        initialRouteName='Main'
        screenOptions={{
          headerStyle: { backgroundColor: '#000' },
          headerTintColor: '#fff',
        }}>
          <Stack.Screen
            name="Main"
            component={MainScreen}
            options={{title: 'Alarms Plus'}}
          />
          <Stack.Screen
            name="New Alarm"
            component={NewAlarmScreen}
            options={{title: 'Create a New Alarm'}}
          />
          <Stack.Screen
            name="Siren On"
            component={SirenScreen}
            options={{title: 'Alarm Activated'}}
          />
        </Stack.Navigator>
      </View>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}