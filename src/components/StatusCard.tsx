import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  status: string;
  time: string;
  location: { latitude: number; longitude: number } | null;
}

export default function StatusCard({ status, time, location }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{status}</Text>
      {location && (
        <Text style={styles.location}>
          📍 {location.latitude.toFixed(5)} | {location.longitude.toFixed(5)}
        </Text>
      )}
      <Text style={styles.time}>🕒 {time}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 4,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginTop: 6,
  },
  time: {
    fontSize: 14,
    marginTop: 4,
    color: '#555',
  },
});