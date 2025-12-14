import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import getHutbeler from '../api/hutbeApi';

const HutbelerScreen = () => {
  const [hutbeler, setHutbeler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getHutbeler();
        setHutbeler(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Camii Hutbeleri</Text>
      {loading && <ActivityIndicator size="large" color="#FFEB3B" style={{ marginTop: 32 }} />}
      {error && <Text style={{ color: 'red', textAlign: 'center', marginTop: 24 }}>{error + ' (Bağlantı hatası, lütfen tekrar deneyin.)'}</Text>}
      {!loading && !error && (
        <ScrollView style={{ width: '100%' }} contentContainerStyle={{ padding: 16 }}>
          {hutbeler.map((hutbe) => (
            <View key={hutbe.id} style={styles.card}>
              <Text style={styles.hutbeTitle}>{hutbe.title}</Text>
              <Text style={styles.hutbeContent}>{hutbe.content}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111a2f' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#FFEB3B', marginTop: 24, marginBottom: 12, textAlign: 'center' },
  card: { backgroundColor: '#1a2236', borderRadius: 14, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4 },
  hutbeTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFEB3B', marginBottom: 8 },
  hutbeContent: { color: '#e6eaf3', fontSize: 15 },
});

export default HutbelerScreen;
