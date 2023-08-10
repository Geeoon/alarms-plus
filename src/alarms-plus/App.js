import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Alert } from 'react-native';
import { useEffect, createRef, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { sirenOn } from './Redux/Siren/sirenSlice';
import { setAlarmActivated } from './Redux/Alarms/alarmsSlice';
import notifee, { TriggerType, AuthorizationStatus, AndroidNotificationSetting } from '@notifee/react-native';
import Sound from 'react-native-sound';
import SystemSetting from 'react-native-system-setting';

import MainScreen from './components/MainScreen';
import NewAlarmScreen from './components/NewAlarmScreen';
import SirenScreen from './components/SirenScreen';
import store from './Redux/store';

const CHANNEL_ID = 'default';
const Stack = createNativeStackNavigator();
Sound.setCategory('Playback');

var systemVolume = 0;  // set default volume, doesn't really matter what it is.
var buzzSound = new Sound(require('./sounds/buzz.mp3'), (error) => {
  if (error) {
    Alert.alert("Unable to load sound, alarms will be silent!");
    console.log(error);
    return;
  }
});

buzzSound.setNumberOfLoops(-1);
buzzSound.setVolume(1);

notifee.onBackgroundEvent(async () => {
  SystemSetting.getVolume().then((volume) => {
    systemVolume = volume
  });
  SystemSetting.setVolume(1);
  buzzSound.play((success) => {
    if (!success) {
      console.log("playback failed");
    }
  });

  console.log("background event.");
});

async function scheudleNotification(title, body, time) {
  const trigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: Date.now() > time ? Date.now() + 1000 : time,
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
      const notId = await scheudleNotification(alarmArray[i].name, 'Your alarm is going off.', alarmArray[i].date);

      console.log('scheduled alarm for ' + Math.trunc((alarmArray[i].date - Date.now()) / 1000) + ' seconds from now. ' + notId);
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
  const navRef = createRef();

  useEffect(() => {
    (async () => {
      // get permissions
      await notifee.requestPermission();

      // create a notification channel
      const channelId = await notifee.createChannel({
        id: CHANNEL_ID,
        name: 'Default Channel',
      });

      // check notification issues
      // if ((await notifee.getNotificationSettings()) != AuthorizationStatus.AUTHORIZED) {
      //   Alert.alert(
      //     'Restrictions Detected', 'Please enable notifications for the app.', [
      //       //launch the settings
      //       {
      //         text: 'Open Settings',
      //         onPress: async() => await notifee.openNotificationSettings(),
      //       },
      //       {
      //         text: "Ignore (The App Won't Work)",
      //         style: 'cancel'
      //       }
      //   ]);
      // }

      // // check alarm issues
      // if ((await notifee.getNotificationSettings()) != AndroidNotificationSetting.ENABLED) {
      //   Alert.alert(
      //     'Restrictions Detected', 'Please disable battery optimization for the app.', [
      //       //launch the settings
      //       {
      //         text: 'Open Settings',
      //         onPress: async() => await notifee.openAlarmPermissionSettings(),
      //       },
      //       {
      //         text: "Ignore (The App Won't Work)",
      //         style: 'cancel'
      //       }
      //   ]);
      // }
      
      // check for battery optimization
      // if (await notifee.isBatteryOptimizationEnabled()) {
      //   Alert.alert(
      //     'Restrictions Detected', 'Please disable battery optimization for the app.', [
      //       //launch the settings
      //       {
      //         text: 'Open Settings',
      //         onPress: async() => await notifee.openBatteryOptimizationSettings(),
      //       },
      //       {
      //         text: "Ignore (The App Won't Work)",
      //         style: 'cancel'
      //       }
      //   ]);
      // }

      // check for power management issues
      // if ((await notifee.getPowerManagerInfo()).activity) {
      //   Alert.alert(
      //     'Restrictions Detected', 'Please change settings to prevent this app from being killed in the background.', [
      //       // launch the settings
      //       {
      //         text: 'Open Settings',
      //         onPress: async() => await notifee.openPowerManagerSettings(),
      //       },
      //       {
      //         text: "Ignore (The App Won't Work)",
      //         style: 'cancel'
      //       }
      //   ]);
      // }
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
        });  // unless the volume is already at max
        SystemSetting.setVolume(1);
        buzzSound.play();
      } else {
        navRef.current?.navigate('Main');
        if (!!systemVolume) {
          SystemSetting.setVolume(systemVolume);
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