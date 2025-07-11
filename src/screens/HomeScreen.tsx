import React from 'react';
import { View, StyleSheet } from 'react-native';
import useLocation from '../hooks/useLocation';
import StatusCard from '../components/StatusCard';

export default function HomeScreen() {
  const { status, location, time } = useLocation();

  return (
    <View style={styles.container}>
      <StatusCard status={status} location={location} time={time} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e6f2ff',
  },
});