import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Basit widget örneği: Namaz vakti, zikir, kaza borcu
export default function WidgetPreview() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Widget Önizleme</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Sonraki Namaz: Öğle</Text>
        <Text style={styles.label}>Kalan Süre: 02:15</Text>
        <Text style={styles.label}>Zikir: 33</Text>
        <Text style={styles.label}>Kaza Borcu: 5</Text>
      </View>
      <Text style={styles.info}>Widget ana ekrana eklemek için cihaz ayarlarından ekleyebilirsiniz.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8ff',
    padding: 16,
    alignItems: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#274690',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
    width: '100%',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#274690',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  info: {
    fontSize: 14,
    color: '#222',
    marginTop: 12,
    textAlign: 'center',
  },
});
