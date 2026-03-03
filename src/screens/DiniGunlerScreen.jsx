import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useThemeContext } from '../context/ThemeContext';
import { useNotificationContext } from '../context/NotificationContext';

const importantDates = [
  { name: 'Üç Ayların Başlangıcı', date: '2025-12-20', hijri: '1 Recep 1447', type: 'ozel' },
  { name: 'Regaib Kandili', date: '2026-01-08', hijri: 'Recep 1’i 2’ye bağlayan gece', type: 'kandil' },
  { name: 'Miraç Kandili', date: '2026-01-26', hijri: '27 Recep 1447', type: 'kandil' },
  { name: 'Berat Kandili', date: '2026-02-13', hijri: '15 Şaban 1447', type: 'kandil' },
  { name: 'Ramazan Başlangıcı', date: '2026-02-19', hijri: '1 Ramazan 1447', type: 'ramazan' },
  { name: 'Kadir Gecesi', date: '2026-03-17', hijri: '27 Ramazan 1447', type: 'kandil' },
  { name: 'Ramazan Bayramı Arife', date: '2026-03-20', hijri: '', type: 'bayram' },
  { name: 'Ramazan Bayramı 1. Gün', date: '2026-03-21', hijri: '1 Şevval 1447', type: 'bayram' },
  { name: 'Ramazan Bayramı 2. Gün', date: '2026-03-22', hijri: '2 Şevval 1447', type: 'bayram' },
  { name: 'Ramazan Bayramı 3. Gün', date: '2026-03-23', hijri: '3 Şevval 1447', type: 'bayram' },
  { name: 'Kurban Bayramı Arife', date: '2026-05-26', hijri: '', type: 'bayram' },
  { name: 'Kurban Bayramı 1. Gün', date: '2026-05-27', hijri: '10 Zilhicce 1447', type: 'bayram' },
  { name: 'Kurban Bayramı 2. Gün', date: '2026-05-28', hijri: '11 Zilhicce 1447', type: 'bayram' },
  { name: 'Kurban Bayramı 3. Gün', date: '2026-05-29', hijri: '12 Zilhicce 1447', type: 'bayram' },
  { name: 'Kurban Bayramı 4. Gün', date: '2026-05-30', hijri: '13 Zilhicce 1447', type: 'bayram' },
  { name: 'Hicri Yılbaşı', date: '2026-06-16', hijri: '1 Muharrem 1448', type: 'hicri' },
  { name: 'Aşure Günü', date: '2026-06-25', hijri: '10 Muharrem 1448', type: 'ozel' }
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

  // Modern ve kronolojik sıralama
  const sortedDates = importantDates.slice().sort((a, b) => new Date(a.date) - new Date(b.date));

  const getTypeColor = (type) => {
    switch (type) {
      case 'bayram': return '#00C897';
      case 'kandil': return '#FFD700';
      case 'ramazan': return '#6C63FF';
      case 'hicri': return '#FF6B6B';
      case 'ozel': return '#00B4D8';
      default: return '#888';
    }
  };

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
    <View style={{ flex: 1, backgroundColor: themeColors.background, padding: 0 }}>
      <Text style={styles.title}>🕌 2026 Dini Günler</Text>
      {loading && <ActivityIndicator size="large" color="#FFEB3B" style={{ marginBottom: 12 }} />}
      <FlatList
        data={sortedDates}
        keyExtractor={item => item.name + item.date}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        renderItem={({ item }) => (
          <View style={[styles.card, { borderLeftColor: getTypeColor(item.type) }] }>
            <Text style={[styles.name, { color: getTypeColor(item.type) }]}>{item.name}</Text>
            <View style={styles.row}>
              <Text style={styles.date}>{item.date}</Text>
              {item.hijri ? <Text style={styles.hijri}>• {item.hijri}</Text> : null}
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#274690',
    marginTop: 24,
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderLeftWidth: 6,
    borderLeftColor: '#00B4D8',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  date: {
    fontSize: 16,
    color: '#274690',
    fontWeight: '500',
  },
  hijri: {
    fontSize: 15,
    color: '#888',
    marginLeft: 8,
  },
});

export default DiniGunlerScreen;
