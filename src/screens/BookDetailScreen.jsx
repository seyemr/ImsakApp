import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Image, TouchableOpacity, Linking } from 'react-native';
import { getBookDetail } from '../api/libraryApi';

export default function BookDetailScreen({ route }) {
  const { id } = route.params || {};
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getBookDetail(id);
        setBook(data);
      } catch (e) {
        setError('Kitap detayı alınamadı.');
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  if (loading) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" color="#a94442" /><Text style={{ marginTop: 16 }}>Yükleniyor...</Text></View>;
  if (error) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: 'red' }}>{error}</Text></View>;
  if (!book) return null;
  const info = book.volumeInfo || {};
  const access = book.accessInfo || {};
  const readerLink = access.webReaderLink || info.previewLink;
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff', padding: 16 }}>
      {info.imageLinks?.thumbnail && (
        <View style={{ alignItems: 'center', marginBottom: 16 }}>
          <Image source={{ uri: info.imageLinks.thumbnail }} style={{ width: 120, height: 180, borderRadius: 8 }} />
        </View>
      )}
      <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#a94442', marginBottom: 8 }}>{info.title || 'İsimsiz Kitap'}</Text>
      <Text style={{ fontSize: 16, color: '#274690', marginBottom: 12 }}>{info.authors ? info.authors.join(', ') : 'Yazar Bilgisi Yok'}</Text>
      <View style={{ backgroundColor: '#f6f6f6', borderRadius: 10, padding: 16, marginTop: 8 }}>
        <Text style={{ fontSize: 17, fontWeight: 'bold', color: '#274690', marginBottom: 8 }}>Kitap İçeriği</Text>
        <Text style={{ fontSize: 15, color: '#333' }}>
          {info.description ? info.description : 'Bu kitap için içerik/açıklama bulunamadı.'}
        </Text>
      </View>
      {readerLink && (
        <TouchableOpacity
          style={{ marginTop: 18, backgroundColor: '#274690', borderRadius: 8, padding: 12, alignItems: 'center' }}
          onPress={() => {
            // WebReaderLink ile kitap tam metnine yönlendir
            Linking.openURL(readerLink);
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Kitabı Oku</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}
