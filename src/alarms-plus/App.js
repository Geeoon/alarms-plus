import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { useEffect, createRef, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { sirenOn } from './Redux/Siren/sirenSlice';
import { setAlarmActivated } from './Redux/Alarms/alarmsSlice';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';

import MainScreen from './components/MainScreen';
import NewAlarmScreen from './components/NewAlarmScreen';
import SirenScreen from './components/SirenScreen';
import store from './Redux/store';

const Stack = createNativeStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => {
    console.log("handleNotification called");
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    };
  },
  handleSuccess: async () => {
    console.log("Success");
  },
  handleError: async () => {
    console.log("Error");
  },
});

const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({ data, error, executionInfo }) => {
  console.log('Notification received in background');
});

Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

async function checkAlarms() { // call this every second to check for alarms
  let lastAlarmDate = store.getState().siren.alarmDate;
  let alarmArray = store.getState().alarms.alarms;
  

  for (let i = 0; i < alarmArray.length; i++) {
    if (alarmArray[i].activated === null) {
      let id = await schedulePushNotification(alarmArray[i].name, 'Alarm is going off!', Math.trunc((alarmArray[i].date - Date.now()) / 1000));
      console.log('scheduled notification');
      store.dispatch(setAlarmActivated({ index: i, id: id, }));
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
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
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

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      sound: true,
      lightColor: '#FF231F7C',
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: true,
    });
  }
  
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
    token = (await Notifications.getExpoPushTokenAsync({
      projectId: '7e3597bd-3d85-475b-88d1-b796a29c659c',
    })).data;
  } else {
    alert('Must use physical device to get alarms');
  }

  return token;
}