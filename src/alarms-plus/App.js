import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { useEffect, createRef, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sirenOn } from './Redux/Siren/sirenSlice';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

// purge react-native-push-notification
// purge expo-background-fetch
// purge expo-task-manager
// purge react-native-background-job
// purge react-native-background-timer

import MainScreen from './components/MainScreen';
import NewAlarmScreen from './components/NewAlarmScreen';
import SirenScreen from './components/SirenScreen';
import store from './Redux/store';

const Stack = createNativeStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

function checkAlarmsForeground() { // call this every second to check for alarms
  let lastAlarmDate = store.getState().siren.alarmDate;
  let alarmArray = store.getState().alarms.alarms;

  for (let i = 0; i < alarmArray.length; i++) {
    if (alarmArray[i].date > lastAlarmDate)
      if (alarmArray[i].date < Date.now()) {
        store.dispatch(sirenOn({ name: alarmArray[i].name, date: alarmArray[i].date }));
        schedulePushNotification(alarmArray[i].name, 'Alarm is going off!', 0).then(() => { console.log('pushed notification'); });
        break;
      }
  }
}

function checkAlarmsBackground() {
  let lastAlarmDate = store.getState().siren.alarmDate;
  let alarmArray = store.getState().alarms.alarms;

  for (let i = 0; i < alarmArray.length; i++) {
    if (alarmArray[i].date - 60000 > lastAlarmDate) {  // a minute ahead
      if (alarmArray[i].date - 60000 < Date.now()) {
        store.dispatch(sirenOn({ name: alarmArray[i].name, date: alarmArray[i].date }));
        schedulePushNotification(alarmArray[i].name, 'Alarm is going off!', Math.trunc((Date.now() - alarmArray[i].date) / 1000)).then(() => { console.log('pushed notification'); });
        break;
      }
    }
  }
}


export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const [currentTime, setCurrentTime] = useState(Date.now());
  const isSirenOn = useSelector((state) => state.siren.isOn);
  const navRef = createRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
    });
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    }
  }, []);

  useEffect(() => {
    // this is only needed if the background task doesn't work in the foreground
    const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => {
      clearInterval(interval);
    }

    // start background alarm checking task
  }, []);

  useEffect(() => {  // updates every second
    checkAlarmsForeground();
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

export async function schedulePushNotification(title, body, time) {
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
    },
    trigger: time > 0 ? {
      seconds: time
    } : null,
  });
  return id;
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Fialed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert('Must use physical device to get alarms');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationCategoryAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      sound: true,
      lightColor: '#FF231F7C',
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: true,
    });
  }

  return token;
}