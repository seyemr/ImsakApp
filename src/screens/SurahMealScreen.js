import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { getSurahTurkish, getSurahInfo } from '../api/quranApi';

export default function SurahMealScreen({ route }) {
  const { id } = route.params || {};
  const [surahInfo, setSurahInfo] = useState(null);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const info = await getSurahInfo(id);
        setSurahInfo(info);
        const turkishAyahs = await getSurahTurkish(id);
        console.log('TURKISH MEAL RESPONSE:', turkishAyahs);
        setMeals(turkishAyahs);
      } catch (e) {
        setError('Meal alınamadı.');
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  if (loading) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" color="#a94442" /><Text style={{ marginTop: 16 }}>Yükleniyor...</Text></View>;
  if (error) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: 'red' }}>{error}</Text></View>;
  if (!surahInfo || meals.length === 0) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Meal bulunamadı.</Text></View>;

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ backgroundColor: '#a94442', paddingVertical: 16, alignItems: 'center' }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>{surahInfo.name_simple} Suresi - Meali</Text>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 18 }}>
        {meals.map((item, idx) => (
          <View key={item.id || idx} style={{ marginBottom: 22 }}>
            <Text style={{ fontSize: 18, color: '#333', textAlign: 'center', lineHeight: 28 }}>
              <Text style={{ color: '#a94442', fontWeight: 'bold', fontSize: 16 }}>
                {item.verse_key}
              </Text>
              {'. '}
              {item.text}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
