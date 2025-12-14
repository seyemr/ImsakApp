import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { getBooks, searchBooks } from '../api/libraryApi';
import { useLanguage } from '../context/LanguageContext';
import { useThemeContext } from '../context/ThemeContext';
import { useNotificationContext } from '../context/NotificationContext';

export default function LibraryScreen({ navigation }) {
  const { themeColors } = useThemeContext();
  const { imsakNotif, aksamNotif } = useNotificationContext();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getBooks();
        setBooks(data);
      } catch (e) {
        setError(t('booksFailed'));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [t]);

  async function handleSearch() {
    if (!search.trim()) return;
    setSearching(true);
    setError(null);
    try {
      const data = await searchBooks(search.trim());
      setBooks(data);
    } catch (e) {
      setError(t('searchFailed'));
    } finally {
      setSearching(false);
    }
  }

  // Türkçe karakter veya kelime içeren kitapları üstte göstermek için sıralama
  const sortedBooks = [...books].sort((a, b) => {
    const turkishRegex = /[çğıöşüÇĞİÖŞÜ]|\b(din|islam|dua|tasavvuf|mevlana|namaz|hadis|tefsir|iman|ahlak|ibadet|kuran|sufi|peygamber|ramazan|ezan)\b/i;
    const aTr = turkishRegex.test(a.volumeInfo?.title || '') || turkishRegex.test(a.volumeInfo?.description || '') ? 1 : 0;
    const bTr = turkishRegex.test(b.volumeInfo?.title || '') || turkishRegex.test(b.volumeInfo?.description || '') ? 1 : 0;
    return bTr - aTr;
  });

  if (loading) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: themeColors.background }}><ActivityIndicator size="large" color="#a94442" /><Text style={{ marginTop: 16, color: themeColors.text }}>{t('loading')}</Text></View>;
  if (error) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: themeColors.background }}><Text style={{ color: 'red' }}>{error}</Text></View>;
  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background, padding: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#a94442', textAlign: 'center', marginBottom: 16 }}>{t('library')}</Text>
      <View style={{ flexDirection: 'row', marginBottom: 12 }}>
        <TextInput
          style={{ color: '#222', fontSize: 16, paddingHorizontal: 10, paddingVertical: 6, flex: 1 }}
          value={search}
          onChangeText={setSearch}
          placeholder={t('bookSearch')}
          placeholderTextColor="#888"
          autoCorrect={false}
          autoCapitalize="none"
          underlineColorAndroid="transparent"
          importantForAutofill="no"
        />
        <TouchableOpacity onPress={handleSearch} style={{ marginLeft: 8, backgroundColor: '#274690', borderRadius: 8, padding: 10 }}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>{t('search')}</Text>
        </TouchableOpacity>
      </View>
      {searching && <ActivityIndicator size="small" color="#274690" style={{ marginBottom: 8 }} />}
      <FlatList
        data={sortedBooks}
        keyExtractor={(item, idx) => item.id ? item.id.toString() : idx.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ backgroundColor: '#f6f6f6', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2 }}
            onPress={() => navigation && navigation.navigate ? navigation.navigate('BookDetail', { id: item.id }) : null}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#274690' }}>{item.volumeInfo?.title || t('unnamedBook')}</Text>
            <Text style={{ fontSize: 15, color: '#333', marginTop: 4 }}>
              {item.volumeInfo?.authors ? item.volumeInfo.authors.join(', ') : t('authorUnknown')}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
