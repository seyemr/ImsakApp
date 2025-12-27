import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchMonthlyPrayerTimes } from '../api/imsakiye';
import { useThemeContext } from '../context/ThemeContext';
import { useNotificationContext } from '../context/NotificationContext';
import CitySelector from '../components/CitySelector';

const vakitKeys = [
    { key: 'Imsak', label: 'İmsak' },
    { key: 'Sunrise', label: 'Güneş' },
    { key: 'Dhuhr', label: 'Öğle' },
    { key: 'Asr', label: 'İkindi' },
    { key: 'Maghrib', label: 'Akşam' },
    { key: 'Isha', label: 'Yatsı' },
];

const MonthlyScreen = () => {
  const { themeColors } = useThemeContext();
  const { imsakNotif, aksamNotif } = useNotificationContext();
  const [city, setCity] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Şehir seçimini ve veri yüklemeyi yönet
  useEffect(() => {
    const loadCity = async () => {
      setLoading(true);
      setError(null);
      const selected = await AsyncStorage.getItem('selected_city');
      if (selected) setCity(selected);
      else setLoading(false);
    };
    loadCity();
  }, []);

  // Şehir değiştiğinde veya ilk yüklendiğinde imsakiye verisini çek
  useEffect(() => {
    if (!city) {
      setData(null);
      setLoading(true);
      return;
    }
    setLoading(true);
    setError(null);
    setData(null);
    fetchMonthlyPrayerTimes(city)
      .then((result) => {
        if (!result || !Array.isArray(result) || result.length === 0) {
          setError('Seçilen şehir için imsakiye verisi bulunamadı.');
          setData(null);
        } else {
          setData(result);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(typeof err === 'string' ? err : 'İmsakiye verisi alınırken bir hata oluştu.');
        setData(null);
        setLoading(false);
      });
  }, [city]);

  const todayISO = new Date().toISOString().split("T")[0];

  // Yükleniyor
  if (loading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: themeColors.background }}>
      <ActivityIndicator size="large" color={themeColors.primary} style={{ marginTop: 32 }} />
      <Text style={{ color: themeColors.text, marginTop: 16 }}>Yükleniyor...</Text>
    </View>
  );

  // Hata varsa göster ve tekrar şehir seçtir
  if (error) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: themeColors.background, padding: 32 }}>
      <Text style={{ fontSize: 48, color: themeColors.error, marginBottom: 16 }}>!</Text>
      <Text style={{ color: themeColors.error, fontSize: 18, textAlign: 'center', marginBottom: 16 }}>{error}</Text>
      <CitySelector onSelect={(c) => { setCity(c); setError(null); setLoading(true); }} />
    </View>
  );

  // Şehir seçilmemişse CitySelector göster
  if (!city) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: themeColors.background }}>
      <Text style={{ color: themeColors.text, fontSize: 16, marginBottom: 16 }}>Lütfen bir şehir seçin</Text>
      <CitySelector onSelect={(c) => { setCity(c); setError(null); setLoading(true); }} />
    </View>
  );

  // Veri yoksa
  if (!data || !Array.isArray(data) || data.length === 0) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: themeColors.background }}>
      <Text style={{ color: themeColors.text, fontSize: 16, marginBottom: 16 }}>İmsakiye verisi bulunamadı.</Text>
      <CitySelector onSelect={(c) => { setCity(c); setError(null); setLoading(true); }} />
    </View>
  );

  const aylar = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  return (
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>  
        {/* Sticky header */}
        <View style={styles.stickyHeaderWrapper}>
          <View style={styles.headerTopRow}>
            <Text style={styles.headerTitle}>{city ? `${city.toUpperCase()} (${new Date().getFullYear()})` : 'Aylık İmsakiye'}</Text>
            {!!city && <View style={styles.headerCitySelector}><CitySelector onSelect={(c) => { setCity(c); setError(null); setLoading(true); }} /></View>}
          </View>
          <View style={styles.tableHeaderRow}>
            <Text style={styles.tableHeaderCell}>Vakitler</Text>
            <Text style={styles.tableHeaderCell}>İmsak</Text>
            <Text style={styles.tableHeaderCell}>Güneş</Text>
            <Text style={styles.tableHeaderCell}>Öğle</Text>
            <Text style={styles.tableHeaderCell}>İkindi</Text>
            <Text style={styles.tableHeaderCell}>Akşam</Text>
            <Text style={styles.tableHeaderCell}>Yatsı</Text>
          </View>
        </View>
        {/* Table body */}
        <ScrollView style={styles.tableBody} contentContainerStyle={{ paddingBottom: 32 }}>
          {data && data.map((item, idx) => {
            const [day, month, year] = item.date.gregorian.date.split('-');
            const itemISO = `${year}-${month}-${day}`;
            const isToday = itemISO === todayISO;
            const rowBg = isToday ? styles.todayRow : styles.tableRow;
            const turkceTarih = `${day} ${aylar[parseInt(month, 10) - 1]} ${year}`;
            return (
                <View key={item.date.readable} style={rowBg}>
                  <Text style={[styles.tableCell, styles.dateCell, isToday && styles.todayCell]}>{turkceTarih}</Text>
                  {vakitKeys.map(({ key }) => {
                    const vakitValue = item.timings[key]
                      .replace(/\s*\(\+\d+\)/, '')
                      .replace(/\s*\+\d+/, '');
                    return (
                      <Text
                        key={key}
                        style={[styles.tableCell, isToday && styles.todayCell]}
                      >
                        {vakitValue}
                      </Text>
                    );
                  })}
                </View>
            );
          })}
        </ScrollView>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8ecf4',
  },
  stickyHeaderWrapper: {
    backgroundColor: '#223366',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 10,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
    flex: 1,
  },
  headerCitySelector: {
    marginLeft: 8,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#223366',
    borderBottomWidth: 2,
    borderBottomColor: '#b6c8e6',
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  tableHeaderCell: {
    flex: 1,
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#3a4a7c',
    paddingVertical: 4,
  },
  tableBody: {
    flex: 1,
    backgroundColor: '#e8ecf4',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#dbe3f3',
    borderLeftWidth: 2,
    borderLeftColor: '#223366',
    borderRightWidth: 2,
    borderRightColor: '#223366',
    marginHorizontal: 0,
    minHeight: 38,
    alignItems: 'center',
  },
  todayRow: {
    flexDirection: 'row',
    backgroundColor: '#e3f0ff',
    borderBottomWidth: 2,
    borderBottomColor: '#4a90e2',
    borderLeftWidth: 2,
    borderLeftColor: '#223366',
    borderRightWidth: 2,
    borderRightColor: '#223366',
    marginHorizontal: 0,
    minHeight: 38,
    alignItems: 'center',
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    color: '#223366',
    textAlign: 'center',
    paddingVertical: 4,
    borderRightWidth: 1,
    borderRightColor: '#dbe3f3',
  },
  dateCell: {
    fontWeight: '700',
    fontSize: 13,
    color: '#223366',
    backgroundColor: 'transparent',
  },
  todayCell: {
    color: '#d32f2f',
    fontWeight: '800',
  },
});


export default MonthlyScreen;
