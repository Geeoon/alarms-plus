import { Button, StyleSheet, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { sirenOff } from '../Redux/Siren/sirenSlice';

export default function SirenScreen({navigation}) {
    const dispatch = useDispatch();
    return (
        <View style={styles.container}>
            <Text style={styles.text}></Text>
            <Button title='DISMISS' onPress={dispatch(sirenOff)}/>
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
    fontSize: 50
  },
});