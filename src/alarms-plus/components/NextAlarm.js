import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

function dhm(t){
    var cd = 24 * 60 * 60 * 1000,
        ch = 60 * 60 * 1000,
        d = Math.floor(t / cd),
        h = Math.floor( (t - d * cd) / ch),
        m = Math.round( (t - d * cd - h * ch) / 60000),
        pad = function(n){ return n < 10 ? '0' + n : n; };
  if( m === 60 ){
    h++;
    m = 0;
  }
  if( h === 24 ){
    d++;
    h = 0;
  }
  return [d, pad(h), pad(m)].join(':');
}

export default function NextAlarm(props) {
    const alarmArray = useSelector((state) => state.alarms.alarms);
    const [timeTillNext, setTimeTillNext] = useState(null);

    return (
    <View style={styles.container}>
        <Text style={styles.text}>{timeTillNext > 0 ? `Next Alarm in ${dhm(timeTillNext)}` : 'No Upcoming Alarms'}</Text>
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },

    text: {
        color: '#ffffff',
        fontSize: 30,
        fontWeight: 'bold',
    },
});