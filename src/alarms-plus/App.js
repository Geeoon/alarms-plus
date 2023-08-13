import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Alert } from 'react-native';
import { useEffect, createRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sirenOn } from './Redux/Siren/sirenSlice';
import { setAlarmActivated } from './Redux/Alarms/alarmsSlice';
import notifee, { TriggerType, AuthorizationStatus, AndroidNotificationSetting, EventType, AndroidImportance, AndroidVisibility } from '@notifee/react-native';
import Sound from 'react-native-sound';
import SystemSetting from 'react-native-system-setting';

import MainScreen from './components/MainScreen';
import NewAlarmScreen from './components/NewAlarmScreen';
import SirenScreen from './components/SirenScreen';
import store from './Redux/store';
import { toggleIgnoreBattery } from './Redux/Ignores/ignoresSlice';

const CHANNEL_ID = 'default';
const Stack = createNativeStackNavigator();
Sound.setCategory('Playback');

var systemVolume = 0;  // set default volume, doesn't really matter what it is.
var buzzSound = new Sound(require('./sounds/buzz.mp3'), (error) => {
  if (error) {
    Alert.alert("Unable to load sound, alarms will be silent!");
    return;
  }
  buzzSound.setNumberOfLoops(-1);
  buzzSound.setVolume(1);
});

notifee.onBackgroundEvent(async ({type, detail}) => {
    if (type === EventType.DELIVERED) {
      SystemSetting.getVolume().then((volume) => {
        systemVolume = volume
      });
      SystemSetting.setVolume(1);
      buzzSound.setSpeakerphoneOn(true);
      buzzSound.play((success) => {
      });
    }
});

notifee.registerForegroundService((notification) => {
  return new Promise(() => {
    if (!buzzSound) {
      buzzSound = new Sound(require('./sounds/buzz.mp3'), (error) => {
        if (error) {
          Alert.alert("Unable to load sound, alarms will be silent!");
          return;
        }
        buzzSound.getNumberOfLoops(-1);
        buzzSound.setVolume(1);
      });
    }
  });
});

async function scheudleNotification(title, body, time) {
  const trigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: Date.now() > time ? Date.now() + 1000 : time,
    importance: AndroidImportance.HIGH,
    visibility: AndroidVisibility.PUBLIC,
    alarmManager: {
      allowWhileIdle: true,
    },
  };

  return await notifee.createTriggerNotification(
    {
      title: title,
      body: body,
      android: {
        channelId: CHANNEL_ID,
        pressAction: {
          id: 'default',
        },
      },
    },
    trigger,
  );
}

async function checkAlarms() { // call this every second to check for alarms
  let lastAlarmDate = store.getState().siren.alarmDate;
  let alarmArray = store.getState().alarms.alarms;

  for (let i = 0; i < alarmArray.length; i++) {
    if (alarmArray[i].activated === null) {
      // schedule alarm
      let notId = null;
      for (let j = 0; i <= alarmArray[i].repeats; j++) {
        notId = await scheudleNotification(alarmArray[i].name, 'Your alarm is going off.', alarmArray[i].date + 60000 * j * alarmArray[i].repeatInterval);
      }
      if (notId) {
        store.dispatch(setAlarmActivated({ index: i, id: notId, }));
      }
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
  const [currentTime, setCurrentTime] = useState(Date.now());
  const isSirenOn = useSelector((state) => state.siren.isOn);
  const ignoreBattery = useSelector((state) => state.ignores.ignoreBattery);
  const navRef = createRef();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      // get permissions
      await notifee.requestPermission();

      // create a notification channel
      const channelId = await notifee.createChannel({
        id: CHANNEL_ID,
        name: 'Default Channel',
      });
      
      let notificationSettings = await notifee.getNotificationSettings();
      // check notification issues
      if (notificationSettings.authorizationStatus === AuthorizationStatus.DENIED) {
        Alert.alert(
          'Restrictions Detected', 'Please enable notifications for the app.', [
            //launch the settings
            {
              text: 'Open Settings',
              onPress: async() => await notifee.openNotificationSettings(),
            },
            {
              text: "Ignore (The App Won't Work)",
              style: 'cancel'
            }
        ]);
      }

      // // check alarm issues
      if (notificationSettings.android.alarm === AuthorizationStatus.DENIED) {
        Alert.alert(
          'Restrictions Detected', 'Please disable battery optimization for the app.', [
            //launch the settings
            {
              text: 'Open Settings',
              onPress: async() => await notifee.openAlarmPermissionSettings(),
            },
            {
              text: "Ignore (The App Won't Work)",
              style: 'cancel'
            }
        ]);
      }
      
      // check for battery optimization
      if (await notifee.isBatteryOptimizationEnabled()) {
        Alert.alert(
          'Restrictions Detected', 'Please disable battery optimization for the app.', [
            //launch the settings
            {
              text: 'Open Settings',
              onPress: async() => await notifee.openBatteryOptimizationSettings(),
            },
            {
              text: "Ignore (The App Won't Work)",
              style: 'cancel'
            }
        ]);
      }

      // check for power management issues
      const powerManagerInfo = await notifee.getPowerManagerInfo();
      if (powerManagerInfo.activity && !ignoreBattery) {
        Alert.alert(
          'Possible Restrictions', 'This device is known to have settings that will kill this app in the background. Please disable them. If you have already addressed these issues, you can ignore this warning.', [
            // launch the settings
            {
              text: 'Open Settings',
              onPress: async() => await notifee.openPowerManagerSettings(),
            },
            {
              text: "Ignore and Don't Ask Again",
              onPress: async () => { dispatch(toggleIgnoreBattery()) },
              style: 'cancel'
            }
        ]);
      }
      notifee.displayNotification({
        title: 'Alarms Activated!  You May Close the App',
        body: 'It is now safe to swipe away the app from the miltitasking menu!',
        android: {
          channelId: CHANNEL_ID,
          asForegroundService: true,
        }
      });
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
        SystemSetting.getVolume().then((vol) => {
          systemVolume = vol;
        });
        SystemSetting.setVolume(1);
        buzzSound.setSpeakerphoneOn(true);
        buzzSound.play();
      } else {
        navRef.current?.navigate('Main');
        if (!!systemVolume) {
          SystemSetting.setVolume(0.50);
        }
        buzzSound.stop();
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