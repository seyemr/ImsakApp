import { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { getSurahList } from '../api/quranApi';
import styles from '../styles/styles';
import surahNamesTr from '../data/surahNames.tr.json';
import { useThemeContext } from '../context/ThemeContext';
import { useNotificationContext } from '../context/NotificationContext';

export default function SurahListScreen({ navigation }) {
  const { themeColors } = useThemeContext();
  const { imsakNotif, aksamNotif } = useNotificationContext();
  const [surahs, setSurahs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true); setError(null);
    try {
      const data = await getSurahList();
      if (!Array.isArray(data) || data.length === 0) throw new Error('Sûre listesi alınamadı.');
      const dataWithTr = data.map((s, i) => ({ ...s, turkishName: surahNamesTr[i] }));
      setSurahs(dataWithTr);
      setFiltered(dataWithTr);
    } catch (e) {
      setError(e.message || 'Sûre listesi alınamadı.');
    } finally {
      setLoading(false);
    }
  };

  const search = (text) => {
    const f = surahs.filter((s) =>
      (s.turkishName || '').toLowerCase().includes(text.toLowerCase()) ||
      (s.englishName || '').toLowerCase().includes(text.toLowerCase())
    );
    setFiltered(f);
  };

  if (loading) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: themeColors.background }}><Text style={{ color: themeColors.text }}>{t('loading')}</Text></View>;
  if (error) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: themeColors.background }}><Text style={{ color: 'red' }}>{error}</Text></View>;
  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      <Text style={[styles.header, { color: themeColors.text }]}>{t('surahs')}</Text>
      <TextInput
        style={{ color: '#222', fontSize: 16, paddingHorizontal: 10, paddingVertical: 6 }}
        placeholder="Sûre ara..."
        placeholderTextColor="#888"
        onChangeText={search}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.number.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.surahItem}
            onPress={() => navigation.navigate('SurahDetail', { id: item.number })}
          >
            <Text style={styles.surahNumber}>{item.number}</Text>
            <View>
              <Text style={styles.surahName}>{item.turkishName}</Text>
              <Text style={styles.surahSub}>{item.englishName}</Text>
            </View>
            <Text style={styles.surahCount}>{item.numberOfAyahs} ayet</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
