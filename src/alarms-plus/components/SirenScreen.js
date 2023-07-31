import { Button, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { sirenOff } from '../Redux/Siren/sirenSlice';

export default function SirenScreen({navigation}) {
    const alarmName = useSelector((state) => state.siren.alarmName);
    const alarmDate = useSelector((state) => state.siren.alarmDate);
    const dispatch = useDispatch();
    
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{alarmName}</Text>
            <Text style={styles.text}>{new Date(alarmDate).toLocaleDateString([], {weekday: 'short', hour: '2-digit', minute:'2-digit'})}</Text>
            <Button title='DISMISS' onPress={() => { dispatch(sirenOff()); }}/>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  text: {
    textAlign: 'center',
    fontSize: 50,
    color: 'black',
  },
});