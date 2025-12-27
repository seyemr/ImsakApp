import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Namaz vakti widget'i için önizleme bileşeni
export default function WidgetPreview({ vakit, kalanSure, city }) {
  const [selectedCity, setSelectedCity] = useState(city || 'İstanbul');

  useEffect(() => {
    (async () => {
      if (!city) {
        const c = await AsyncStorage.getItem('@selected_city');
        if (c) setSelectedCity(c);
      }
    })();
  }, [city]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Namaz Vakti Widget</Text>
      <View style={styles.card}>
        <Text style={styles.city}>{selectedCity}</Text>
        <Text style={styles.label}>
          Sonraki Namaz:{' '}
          <Text style={styles.value}>{vakit || 'Bilinmiyor'}</Text>
        </Text>
        <Text style={styles.label}>
          Kalan Süre:{' '}
          <Text style={styles.value}>{kalanSure || '--:--'}</Text>
        </Text>
      </View>
      <Text style={styles.info}>
        Widget ana ekrana eklemek için cihaz ayarlarından ekleyebilirsiniz.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#162447', // Lacivert ton
    padding: 16,
    alignItems: 'center',
    borderRadius: 18,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#e6eaf3',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1f4068', // Lacivert ton
    borderRadius: 14,
    padding: 24,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
    alignItems: 'center',
  },
  city: {
    fontSize: 18,
    color: '#21e6c1',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: '#e6eaf3',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  value: {
    color: '#21e6c1',
    fontWeight: 'bold',
  },
  info: {
    fontSize: 14,
    color: '#e6eaf3',
    marginTop: 12,
    textAlign: 'center',
  },
});
