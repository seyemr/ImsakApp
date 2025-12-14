import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { getSurahArabic, getSurahInfo } from '../api/quranApi';

export default function SurahArabicScreen({ route }) {
  const { id } = route.params || {};
  const [surahInfo, setSurahInfo] = useState(null);
  const [ayahs, setAyahs] = useState([]);

  useEffect(() => {
    async function load() {
      const info = await getSurahInfo(id);
      setSurahInfo(info);
      const arabicAyahs = await getSurahArabic(id);
      setAyahs(arabicAyahs);
    }
    if (id) load();
  }, [id]);

  if (!surahInfo || ayahs.length === 0) return null;

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ backgroundColor: '#a94442', paddingVertical: 16, alignItems: 'center' }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>{surahInfo.name_arabic} / {surahInfo.name_simple} Suresi</Text>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 18 }}>
        {ayahs.map((item) => (
          <View key={item.id} style={{ marginBottom: 22 }}>
            <Text style={{ fontSize: 28, color: '#222', textAlign: 'center', fontFamily: 'ScheherazadeNew', lineHeight: 44 }}>
              <Text style={{ color: '#a94442', fontWeight: 'bold', fontSize: 20 }}>
                {item.verse_number}
              </Text>
              {'. '}
              {item.text_uthmani}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
