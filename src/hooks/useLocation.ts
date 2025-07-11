import { useEffect, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { CENTER_POINT, ROOM_POLYGON, MAX_TOLERANCE_DISTANCE } from '../utils/contants';

export default function useLocation() {
  const [status, setStatus] = useState('Checking location...');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [time, setTime] = useState('');

  useEffect(() => {
    const requestPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          setStatus('❌ Location permission denied');
          return;
        }
      }

      Geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation({ latitude, longitude });

          const insidePolygon = isPointInPolygon({ latitude, longitude }, ROOM_POLYGON);
          const distance = calculateDistance(
            latitude,
            longitude,
            CENTER_POINT.latitude,
            CENTER_POINT.longitude
          );

          const currentTime = new Date().toLocaleTimeString();
          setTime(currentTime);

          if (insidePolygon || distance <= MAX_TOLERANCE_DISTANCE) {
            setStatus('👤 Muhammad Haris Siddiqui');
          } else {
            setStatus('🚫 Not in Room');
          }
        },
        (error) => {
          setStatus('Error getting location');
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 1,
          interval: 2000,
          fastestInterval: 1000,
        }
      );
    };

    requestPermission();
    return () => {
      Geolocation.stopObserving();
    };
  }, []);

  return { status, location, time };
}

function isPointInPolygon(
  point: { latitude: number; longitude: number },
  polygon: { latitude: number; longitude: number }[]
): boolean {
  let x = point.latitude;
  let y = point.longitude;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].latitude, yi = polygon[i].longitude;
    const xj = polygon[j].latitude, yj = polygon[j].longitude;

    const intersect = ((yi > y) !== (yj > y)) &&
      (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);

    if (intersect) inside = !inside;
  }

  return inside;
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}