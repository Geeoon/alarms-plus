import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { useEffect, createRef } from 'react';
import { useSelector } from 'react-redux';

import MainScreen from './components/MainScreen';
import NewAlarmScreen from './components/NewAlarmScreen';
import SirenScreen from './components/SirenScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const sirenOn = useSelector((state) => state.siren.isOn);
  const navRef = createRef();

  useEffect(() => {
    if (navRef.current) {
      if (sirenOn) {
        navRef.current?.navigate('Siren On');
      } else {
        navRef.current?.navigate('Main');
      }
    }
  }, [sirenOn, navRef]);

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