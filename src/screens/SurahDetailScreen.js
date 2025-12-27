import { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, I18nManager, StyleSheet, Dimensions, Platform, ScrollView, PermissionsAndroid, TextInput } from 'react-native';
import { getSurahArabic, getSurahInfo } from '../api/quranApi';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemeContext } from '../context/ThemeContext';
import { useNotificationContext } from '../context/NotificationContext';
import { useLanguage } from '../context/LanguageContext';

export default function SurahDetailScreen({ route, navigation }) {
  const { t } = useLanguage();
  const { id } = route?.params || {};
  const { themeColors } = useThemeContext();
  const { imsakNotif, aksamNotif } = useNotificationContext();
  const [surahInfo, setSurahInfo] = useState(null);
  const [ayahs, setAyahs] = useState([]);
  const [fontSizeArabic, setFontSizeArabic] = useState(32);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [lastRead, setLastRead] = useState(null);
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState([]);
  const flatListRef = useRef(null);
  const { width, height } = Dimensions.get('window');
  const AYAT_PER_PAGE = 5;
  I18nManager.allowRTL(true);

  useEffect(() => { 
    if (id) load(); 
    // Son okunan ayeti yükle
    (async () => {
      const key = `last_read_${id}`;
      const saved = await AsyncStorage.getItem(key);
      if (saved) setLastRead(Number(saved));
    })();
  }, [id]);

  // Favori ayetleri yükle
  useEffect(() => {
    if (!id) return;
    (async () => {
      const favKey = `fav_ayahs_${id}`;
      const favs = await AsyncStorage.getItem(favKey);
      setFavorites(favs ? JSON.parse(favs) : []);
    })();
  }, [id]);

  const load = async () => {
    setLoading(true); setError(null);
    try {
      const info = await getSurahInfo(id);
      setSurahInfo(info);
      const arabicAyahs = await getSurahArabic(id);
      setAyahs(arabicAyahs);
    } catch (e) {
      setError('Ayetler alınamadı.');
    } finally { setLoading(false); }
  };

  // Son okunan ayeti kaydet
  const markLastRead = async (verseNumber) => {
    setLastRead(verseNumber);
    const key = `last_read_${id}`;
    await AsyncStorage.setItem(key, String(verseNumber));
  };

  // Favori ekle/çıkar
  const toggleFavorite = async (verseNumber) => {
    let newFavs;
    if (favorites.includes(verseNumber)) {
      newFavs = favorites.filter(v => v !== verseNumber);
    } else {
      newFavs = [...favorites, verseNumber];
    }
    setFavorites(newFavs);
    const favKey = `fav_ayahs_${id}`;
    await AsyncStorage.setItem(favKey, JSON.stringify(newFavs));
  };

  // Her sayfada AYAT_PER_PAGE ayet
  const pages = [];
  for (let i = 0; i < ayahs.length; i += AYAT_PER_PAGE) {
    pages.push(ayahs.slice(i, i + AYAT_PER_PAGE));
  }
  const surahName = surahInfo?.name_arabic || '';
  const surahLatin = surahInfo?.name_simple || '';
  const juzNumber = surahInfo?.juz_number || surahInfo?.chapter_number || '';

  // Ayet arama filtresi
  const filteredAyahs = search.trim().length > 0
    ? ayahs.filter(
        ayah =>
          ayah.text_uthmani.includes(search) ||
          (ayah.verse_number + '').includes(search)
      )
    : ayahs;

  if (!id) return <View style={[stylesMushaf.center, { backgroundColor: themeColors.background }]}><Text style={{ color: themeColors.text }}>{t('surahNotFound') || 'Sure ID bulunamadı.'}</Text></View>;
  if (loading) return <View style={[stylesMushaf.center, { backgroundColor: themeColors.background }]}><ActivityIndicator size="large" color="#a94442" /><Text style={{ marginTop: 16, color: themeColors.text }}>{t('loading')}</Text></View>;
  if (error) return <View style={[stylesMushaf.center, { backgroundColor: themeColors.background }]}><Text style={{ color: 'red' }}>{t('ayahFetchError') || error}</Text></View>;
  if (!surahInfo || !Array.isArray(ayahs) || ayahs.length === 0) return (
    <View style={[stylesMushaf.center, { backgroundColor: themeColors.background }]}> 
      <Text style={{ color: themeColors.text }}>{t('noAyahFound') || 'Ayet bulunamadı.'}</Text>
      <Text style={{ fontSize: 12, color: '#888', marginTop: 8 }}>Debug: ayahs={Array.isArray(ayahs) ? ayahs.length : 'yok'}</Text>
    </View>
  );
  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      {/* Üst bar: Geri ve başlık */}
      <View style={stylesMushaf.headerBar}>
        <TouchableOpacity onPress={() => navigation?.goBack?.()} style={stylesMushaf.backBtn}>
          <Icon name="arrow-left" size={28} color="#bfa76f" />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
          <Text style={stylesMushaf.surahName}>{surahName}</Text>
          <Text style={stylesMushaf.surahLatin}>{surahLatin} <Text style={stylesMushaf.juzNumber}>{juzNumber}. Cüz</Text></Text>
        </View>
        <View style={{ width: 40, height: 40 }} />
      </View>
      {/* Ayet arama barı */}
      <View style={{ paddingHorizontal: 18, paddingTop: 10, paddingBottom: 2 }}>
        <TextInput
          style={{ color: '#222', fontSize: 16, paddingHorizontal: 10, paddingVertical: 6, flex: 1 }}
          value={search}
          onChangeText={setSearch}
          placeholder="Ayet ara..."
          placeholderTextColor="#888"
        />
      </View>
      {/* Mushaf stili: tüm ayetler tek ekranda, satır sonunda klasik numara */}
      <ScrollView contentContainerStyle={{ padding: 18, alignItems: 'center', backgroundColor: '#f7f6ef' }} showsVerticalScrollIndicator={false}>
        <View style={{ width: '100%', maxWidth: 600, backgroundColor: '#f7f6ef', borderRadius: 18, borderWidth: 1.5, borderColor: '#e9e4d7', padding: 12 }}>
          {filteredAyahs.map((ayah) => (
            <View key={ayah.id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 10, flexWrap: 'wrap', backgroundColor: lastRead === ayah.verse_number ? '#fffbe9' : 'transparent', borderRadius: 10 }}>
              {/* Favori yıldız ikonu */}
              <TouchableOpacity onPress={() => toggleFavorite(ayah.verse_number)} style={{ marginRight: 8 }}>
                <Icon name={favorites.includes(ayah.verse_number) ? 'star' : 'star-outline'} size={24} color={favorites.includes(ayah.verse_number) ? '#ffd700' : '#bfa76f'} />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7} onPress={() => markLastRead(ayah.verse_number)} style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 28,
                    color: '#222',
                    textAlign: 'right',
                    fontFamily: 'Amiri Quran',
                    lineHeight: 44,
                    writingDirection: 'rtl',
                    backgroundColor: 'transparent',
                    marginLeft: 8,
                    fontWeight: lastRead === ayah.verse_number ? 'bold' : 'normal',
                  }}
                >
                  {ayah.text_uthmani + ' '}
                  <Text style={{ fontSize: 22, color: lastRead === ayah.verse_number ? '#a94442' : '#bfa76f', fontWeight: 'bold', marginLeft: 0, marginRight: 0, textAlign: 'right' }}>
                    {ayah.verse_number}
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const stylesMushaf = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f7f6ef' },
  headerBar: {
    flexDirection: 'row', alignItems: 'center', paddingTop: Platform.OS === 'ios' ? 48 : 24, paddingBottom: 12, paddingHorizontal: 12,
    backgroundColor: '#f7f6ef', borderBottomWidth: 1.5, borderBottomColor: '#e9e4d7',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, zIndex: 10,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  surahName: { fontSize: 22, color: '#a94442', fontWeight: 'bold', fontFamily: 'Amiri Quran', textAlign: 'center' },
  surahLatin: { fontSize: 15, color: '#a94442', fontWeight: '600', fontFamily: 'System', textAlign: 'center' },
  juzNumber: { fontSize: 13, color: '#bfa76f', fontWeight: 'bold' },
  ayahCircleMushaf: {
    alignItems: 'center', justifyContent: 'center', borderRadius: 16, minWidth: 32, minHeight: 32,
    marginLeft: 4, marginRight: 0, marginBottom: 0, paddingHorizontal: 8, paddingVertical: 2,
    borderWidth: 1, borderColor: '#bfa76f', backgroundColor: '#fffbe9',
    shadowColor: '#bfa76f', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 4, elevation: 2,
  },
  ayahCircleText: {
    fontSize: 18, color: '#a67c00', fontWeight: 'bold', textAlign: 'center', fontFamily: 'System',
  },
});
