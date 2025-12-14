import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useThemeContext } from '../context/ThemeContext';
import { useNotificationContext } from '../context/NotificationContext';

const importantDates = [
  { name: 'Ramazan Bayramı', date: '2025-03-31' },
  { name: 'Kurban Bayramı', date: '2025-06-07' },
  { name: 'Mevlid Kandili', date: '2025-09-05' },
  { name: 'Regaip Kandili', date: '2025-01-30' },
  { name: 'Miraç Kandili', date: '2025-02-27' },
  { name: 'Berat Kandili', date: '2025-03-16' },
  { name: 'Kadir Gecesi', date: '2025-03-29' },
];

async function fetchHijri(date) {
  const res = await fetch(`https://ummahapi.com/api/hijri-date?date=${date}`);
  const data = await res.json();
  return data;
}

const DiniGunlerScreen = () => {
  const { themeColors } = useThemeContext();
  const { imsakNotif, aksamNotif } = useNotificationContext();
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchDays() {
      const results = [];
      for (const item of importantDates) {
        try {
          const hijri = await fetchHijri(item.date);
          results.push({
            miladi: item.date,
            hijri: hijri.data.hijri.date,
            name: item.name,
            events: hijri.data.hijri.events || [],
            holidays: hijri.data.hijri.holidays || [],
          });
        } catch {
          results.push({ miladi: item.date, hijri: '', name: item.name, events: [], holidays: [] });
        }
      }
      if (isMounted) setDays(results);
      setLoading(false);
    }
    fetchDays();
    return () => { isMounted = false; };
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      <Text style={styles.title}>Bu Yılın Önemli Dini Günleri</Text>
      {loading && <ActivityIndicator size="large" color="#FFEB3B" style={{ marginBottom: 12 }} />}
      <FlatList
        data={days}
        keyExtractor={item => item.miladi}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.date}>{item.miladi} ({item.hijri})</Text>
            <Text style={styles.desc}>{[...(item.events || []), ...(item.holidays || [])].join(', ')}</Text>
          </View>
        )}
        style={{ width: '100%' }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', backgroundColor: '#111a2f', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#FFEB3B', marginBottom: 12 },
  card: { backgroundColor: '#274690', borderRadius: 10, padding: 16, marginBottom: 12 },
  name: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  date: { color: '#FFEB3B', fontSize: 15, marginBottom: 4 },
  desc: { color: '#e6eaf3', fontSize: 15 },
});

export default DiniGunlerScreen;
