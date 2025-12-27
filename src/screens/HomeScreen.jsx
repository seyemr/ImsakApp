import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  Platform,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Card, Text, ActivityIndicator } from 'react-native-paper';
import { useTheme } from '../hooks/useTheme';
import { usePrayerTimes } from '../hooks/usePrayerTimes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { vaktAyetleri } from '../data/vaktAyeti';
import { hadisler } from '../data/vaktHadisi';
import CitySelector from '../components/CitySelector';
import { getAyah } from '../api/quranApi';
import { getRandomHadisFromApi } from '../api/hadisApi';
import { useLanguage } from '../context/LanguageContext';
import { useThemeContext } from '../context/ThemeContext';
import { useNotificationContext } from '../context/NotificationContext';
import QuranProgressBar from '../components/QuranProgressBar';
import Zikirmatik from '../components/Zikirmatik';
import KazaCetelesi from '../components/KazaCetelesi';
import WidgetPreview from '../components/WidgetPreview';
import duas from '../data/duas.json';

const STORAGE_KEY_SELECTED_CITY = '@selected_city';
const STORAGE_KEY_SAVED_CITIES = '@saved_cities';

const vakitKeys = [
  { key: 'Imsak', label: 'İmsak', icon: 'weather-night' },
  { key: 'Sunrise', label: 'Güneş', icon: 'white-balance-sunny' },
  { key: 'Dhuhr', label: 'Öğle', icon: 'clock-outline' },
  { key: 'Asr', label: 'İkindi', icon: 'weather-sunset' },
  { key: 'Maghrib', label: 'Akşam', icon: 'weather-sunset-down' },
  { key: 'Isha', label: 'Yatsı', icon: 'weather-night-partly-cloudy' },
];

function parseTimeToDate(timeStr, baseDate) {
  // timeStr expected like "05:50" or "5:50" or "05:50 (EET)"
  if (!timeStr) return null;
  const cleaned = timeStr.match(/\d{1,2}:\d{2}/)?.[0];
  if (!cleaned) return null;
  const [hour, minute] = cleaned.split(':').map(Number);
  return new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), hour, minute);
}

function getNextVakitFromTimings(timings) {
  const now = new Date();
  for (const { key, label } of vakitKeys) {
    const timeStr = timings[key];
    const vakitDate = parseTimeToDate(timeStr, now);
    if (vakitDate && vakitDate > now) {
      return { next: label, nextKey: key, nextTime: vakitDate };
    }
  }
  // if none found (all today's times passed) -> return tomorrow's Imsak using today's Imsak time but day+1
  const imsak = parseTimeToDate(timings['Imsak'] || timings['Fajr'] || '', now);
  if (imsak) {
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    const nextTime = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), imsak.getHours(), imsak.getMinutes());
    return { next: 'İmsak', nextKey: 'Imsak', nextTime };
  }
  return { next: null, nextKey: null, nextTime: null };
}

function formatCountdown(target) {
  if (!target) return '00:00:00';
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return '00:00:00';
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function pickRandomAyet(ayetsObj) {
  const keys = Object.keys(ayetsObj || {});
  if (!keys.length) return null;
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return ayetsObj[randomKey];
}

// Rastgele ayet için toplam ayet sayısı ve random key üretici
const TOTAL_SURAHS = 114;
const AYAH_COUNTS = [7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128, 111, 110, 98, 135, 112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73, 54, 45, 83, 182, 88, 75, 85, 54, 53, 89, 59, 37, 35, 38, 29, 18, 45, 60, 49, 62, 55, 78, 96, 29, 22, 24, 13, 14, 11, 11, 18, 12, 12, 30, 52, 52, 44, 28, 28, 20, 56, 40, 31, 50, 40, 46, 42, 29, 19, 36, 25, 22, 17, 19, 26, 30, 20, 15, 21, 11, 8, 8, 19, 5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3, 6, 3, 5, 4, 5, 6];
let lastAyahKey = null;

function getRandomAyahKey() {
  let key;
  do {
    const surah = Math.floor(Math.random() * TOTAL_SURAHS) + 1;
    const ayah = Math.floor(Math.random() * AYAH_COUNTS[surah - 1]) + 1;
    key = `${surah}:${ayah}`;
  } while (key === lastAyahKey); // Aynı ayet üst üste gelmesin
  lastAyahKey = key;
  return key;
};

function getRandomHadis() {
  return hadisler[Math.floor(Math.random() * hadisler.length)];
}

const MAX_HADIS_LENGTH = 220;

function HomeScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { t } = useLanguage();
  const { themeColors } = useThemeContext();
  const { imsakNotif, aksamNotif } = useNotificationContext();

  // Konum ayarı ve API'den güncel vakitler
  const [city, setCity] = useState('İstanbul');
  // const [savedCities, setSavedCities] = useState([]);
  // const [modalVisible, setModalVisible] = useState(false);
  // const [newCityInput, setNewCityInput] = useState('');

  // Vakitler API'den güncel olarak çekiliyor
  const { data, loading, error } = usePrayerTimes(city);

  const [nextVakit, setNextVakit] = useState('');
  const [nextVakitTime, setNextVakitTime] = useState(null);
  const [countdown, setCountdown] = useState('00:00:00');
  const countdownRef = useRef(null);

  // Günün ayeti - rasgele
  const [vaktinAyet, setVaktinAyet] = useState(null);
  const [vaktinHadis, setVaktinHadis] = useState(null);
  const [fiveDays, setFiveDays] = useState([]);
  const [hadisModalVisible, setHadisModalVisible] = useState(false);
  const [selectedHadis, setSelectedHadis] = useState(null);
  const [gununDuasi, setGununDuasi] = useState(null);
  const [duaModalVisible, setDuaModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const s = await AsyncStorage.getItem(STORAGE_KEY_SELECTED_CITY);
        if (s) setCity(s);
      } catch (e) {}
      // try {
      //   const sc = await AsyncStorage.getItem(STORAGE_KEY_SAVED_CITIES);
      //   if (sc) setSavedCities(JSON.parse(sc));
      // } catch (e) {}
      setVaktinAyet(pickRandomAyet(vaktAyetleri));
      setVaktinHadis(getRandomHadis());
      // Rastgele günün duası
      setGununDuasi(duas[Math.floor(Math.random() * duas.length)]);
    })();
  }, []);

  useEffect(() => {
    // 5 gün vakitleri
    if (!city) return;
    if (data?.data?.fiveDays) {
      setFiveDays(data.data.fiveDays);
    } else if (data?.data?.timings) {
      const today = new Date();
      const days = Array.from({ length: 5 }, (_, i) => ({
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + i),
        timings: data.data.timings,
      }));
      setFiveDays(days);
    } else {
      setFiveDays([]);
    }
  }, [data, city]);

  useEffect(() => {
    // Vakit ve countdown güncelle
    if (data?.data?.timings) {
      const next = getNextVakitFromTimings(data.data.timings);
      setNextVakit(next.next || '');
      setNextVakitTime(next.nextTime || null);
    }
  }, [data, city]);

  useEffect(() => {
    // Countdown timer
    if (!nextVakitTime) return;
    setCountdown(formatCountdown(nextVakitTime));
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setCountdown(formatCountdown(nextVakitTime));
    }, 1000);
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [nextVakitTime]);

  // VAKTİN AYETİ: API'den rastgele çek ve her vakitte güncelle (sadece Türkçe meal)
  const fetchVaktinAyet = async () => {
    try {
      const key = getRandomAyahKey();
      const ayet = await getAyah(key);
      setVaktinAyet({
        translation: ayet.text, // Sadece Türkçe meal
        reference: `${ayet.surah.englishName} ${ayet.numberInSurah}`
      });
    } catch (e) {
      setVaktinAyet(null);
    }
  };

  useEffect(() => {
    fetchVaktinAyet();
  }, [nextVakit]);

  // VAKTİN HADİSİ: Her vakit değişiminde API'den rastgele hadis
  const fetchVaktinHadis = async () => {
    const hadis = await getRandomHadisFromApi();
    setVaktinHadis(hadis);
  };
  useEffect(() => {
    fetchVaktinHadis();
  }, [nextVakit]);

  // Konum değiştiğinde API'den yeni vakitler çekiliyor
  const saveSelectedCity = async (c) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_SELECTED_CITY, c);
      setCity(c);
      // setModalVisible(false);
      // force fiveDays güncellemesi için setFiveDays([]) ile sıfırla
      setFiveDays([]);
    } catch (e) {}
  };

  // Konum ekleme
  // const addCity = async () => {
  //   const trimmed = newCityInput.trim();
  //   if (!trimmed) return;
  //   const list = Array.isArray(savedCities) ? [...savedCities] : [];
  //   if (list.includes(trimmed)) {
  //     Alert.alert('Uyarı', 'Bu konum zaten kayıtlı.');
  //     return;
  //   }
  //   list.unshift(trimmed);
  //   try {
  //     await AsyncStorage.setItem(STORAGE_KEY_SAVED_CITIES, JSON.stringify(list));
  //     setSavedCities(list);
  //     setNewCityInput('');
  //   } catch (e) {}
  // };

  // Konum silme
  // const removeCity = async (c) => {
  //   const filtered = savedCities.filter(x => x !== c);
  //   try {
  //     await AsyncStorage.setItem(STORAGE_KEY_SAVED_CITIES, JSON.stringify(filtered));
  //     setSavedCities(filtered);
  //   } catch (e) {}
  // };

  // Konum modalı açma
  // const onSelectCityPress = () => setModalVisible(true);

  if (loading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
      <ActivityIndicator size="large" color={theme.primary || '#007AFF'} />
    </View>
  );

  if (error) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
      <Icon name="alert-circle" size={48} color="red" style={{ marginBottom: 12 }} />
      <Text style={{ color: 'red', fontSize: 16, textAlign: 'center' }}>{error}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0b1220' }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
          <View style={styles.topBoxModern}>
            <Text style={styles.countdownLabelModern}>{nextVakit} ezanına kalan</Text>
            <Text style={styles.countdownModern}>{countdown}</Text>
            <View style={styles.dateRowModern}>
              <Text style={styles.dateTextModern}>
                {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' })}
              </Text>
              <Text style={styles.dateTextModern}>{data?.data?.date?.readable || ''}</Text>
              <Text style={styles.dateTextModern}>Yerel saat {new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</Text>
            </View>
          </View>

          <View style={styles.vakitRowModern}>
            {vakitKeys.map(({ key, label }, i) => {
              const isNext = nextVakit === label;
              return (
                <View key={key} style={[styles.vakitItemModern, isNext ? styles.activeVakitModern : null]}>
                  <Icon name={vakitKeys[i].icon} size={22} color={isNext ? '#222' : '#e6eaf3'} />
                  <Text style={[styles.vakitTimeModern, isNext ? styles.activeVakitTimeModern : null]}>{data?.data?.timings?.[key] || '--:--'}</Text>
                  <Text style={[styles.vakitLabelModern, isNext ? styles.activeVakitLabelModern : null]}>{label}</Text>
                  {/* Sadece bir yerde gösterilecek: */}
                  {/* {isNext && (
                    <Text style={{ color: '#222', fontWeight: 'bold', fontSize: 13, marginTop: 2 }}>{countdown} kaldı</Text>
                  )} */}
                </View>
              );
            })}
          </View>

          {/* Modern CitySelector burada */}
          <View style={{ alignItems: 'center', marginVertical: 8 }}>
            <CitySelector onSelect={setCity} />
          </View>

          {/* GÜNÜN AYETİ - rastgele */}
          <Text style={{ color: '#FFEB3B', fontWeight: 'bold', fontSize: 16, textAlign: 'center', marginTop: 8 }}>Vaktin Ayeti</Text>
          <View style={styles.ayetBoxModern}>
            {vaktinAyet ? (
              <>
                <Text style={styles.ayetTranslationModern}>{vaktinAyet.translation}</Text>
                <Text style={styles.ayetRefModern}>{vaktinAyet.reference}</Text>
              </>
            ) : (
              <Text style={{ color: '#fff' }}>Ayet bulunamadı.</Text>
            )}
          </View>

          {/* Vaktin Hadisi */}
          <Text style={{ color: '#FFEB3B', fontWeight: 'bold', fontSize: 16, textAlign: 'center', marginTop: 8 }}>{t('vaktinHadisi') || 'Vaktin Hadisi'}</Text>
          <View style={styles.ayetBoxModern}>
            {vaktinHadis ? (
              <>
                <Text style={styles.ayetTranslationModern}>
                  {vaktinHadis.text.length > MAX_HADIS_LENGTH
                    ? vaktinHadis.text.slice(0, MAX_HADIS_LENGTH) + '...'
                    : vaktinHadis.text}
                </Text>
                {vaktinHadis.text.length > MAX_HADIS_LENGTH && (
                  <TouchableOpacity onPress={() => { setSelectedHadis(vaktinHadis); setHadisModalVisible(true); }}>
                    <Text style={{ color: '#FFEB3B', fontWeight: 'bold', marginBottom: 6 }}>{t('readMore')}</Text>
                  </TouchableOpacity>
                )}
                <Text style={styles.ayetRefModern}>{vaktinHadis.source}</Text>
              </>
            ) : (
              <Text style={{ color: '#fff' }}>{t('hadithNotFound') || 'Hadis bulunamadı.'}</Text>
            )}
          </View>
          <Modal visible={hadisModalVisible} animationType="slide" transparent onRequestClose={() => setHadisModalVisible(false)}>
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 24 }}>
              <View style={{ backgroundColor: '#fff', borderRadius: 18, padding: 18, maxHeight: '80%' }}>
                <ScrollView>
                  <Text style={{ color: '#222', fontSize: 17, marginBottom: 12 }}>{selectedHadis?.text}</Text>
                  <Text style={{ color: '#274690', fontSize: 14, marginBottom: 18 }}>{selectedHadis?.source}</Text>
                </ScrollView>
                <TouchableOpacity onPress={() => setHadisModalVisible(false)} style={{ alignSelf: 'center', marginTop: 8, backgroundColor: '#274690', borderRadius: 8, paddingHorizontal: 18, paddingVertical: 8 }}>
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>{t('close')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* GÜNÜN DUASI */}
          <Text style={{ color: '#FFEB3B', fontWeight: 'bold', fontSize: 16, textAlign: 'center', marginTop: 8 }}>Günün Duası</Text>
          <TouchableOpacity
            style={{ backgroundColor: '#fff', borderRadius: 14, margin: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 2, elevation: 2 }}
            onPress={() => setDuaModalVisible(true)}
            activeOpacity={0.85}
          >
            <Text style={{ color: '#274690', fontWeight: 'bold', fontSize: 18, marginBottom: 6, textAlign: 'center' }}>{gununDuasi?.title}</Text>
            <Text style={{ color: '#232a3b', fontSize: 16, textAlign: 'center' }} numberOfLines={2}>{gununDuasi?.turkish}</Text>
          </TouchableOpacity>
          <Modal visible={duaModalVisible} animationType="slide" transparent onRequestClose={() => setDuaModalVisible(false)}>
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 18 }}>
              <View style={{ backgroundColor: '#fff', borderRadius: 18, padding: 18, width: '100%', maxWidth: 400, maxHeight: '80%' }}>
                <ScrollView>
                  <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#274690', marginBottom: 10, textAlign: 'center' }}>{gununDuasi?.title}</Text>
                  <Text style={{ fontSize: 20, color: '#222', marginBottom: 10, textAlign: 'center', fontFamily: 'AmiriQuran-Regular' }}>{gununDuasi?.arabic}</Text>
                  <Text style={{ fontSize: 17, color: '#232a3b', marginBottom: 10, textAlign: 'center' }}>{gununDuasi?.turkish}</Text>
                  <Text style={{ fontSize: 15, color: '#888', textAlign: 'center', marginBottom: 10 }}>{gununDuasi?.category}</Text>
                </ScrollView>
                <TouchableOpacity onPress={() => setDuaModalVisible(false)} style={{ alignSelf: 'center', marginTop: 10, backgroundColor: '#274690', borderRadius: 8, paddingHorizontal: 18, paddingVertical: 8 }}>
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Kapat</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Yeni özellikler için butonlar */}
          <View style={styles.menuRowModern}>
            <TouchableOpacity style={styles.menuItemModern} onPress={() => navigation.navigate('KuranMeali')}>
              <Icon name="book-open" size={32} color="#274690" />
              <Text style={styles.menuLabelModern}>Kuran Meali</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItemModern} onPress={() => navigation.navigate('Dualar')}>
              <Icon name="hands-pray" size={32} color="#274690" />
              <Text style={styles.menuLabelModern}>Dualar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItemModern} onPress={() => navigation.navigate('WidgetPreview')}>
              <Icon name="widgets" size={32} color="#274690" />
              <Text style={styles.menuLabelModern}>Widget</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItemModern} onPress={() => navigation.navigate('Zikirmatik')}>
              <Icon name="counter" size={32} color="#274690" />
              <Text style={styles.menuLabelModern}>Zikirmatik</Text>
            </TouchableOpacity>
          </View>
          {/* Takipli Kuran, Kaza Çetelesi ana ekranda gösterilebilir */}
          {/* <QuranProgressBar page={1} totalPages={675} /> */}
          {/* <KazaCetelesi /> */}

          {/* Menü butonları */}
          <View style={styles.bottomBoxModern}>
            <View style={styles.menuRowModern}>
              {/* Kur'an butonu sadece QuranPdf ekranına yönlendirilecek */}
              <TouchableOpacity style={styles.menuItemModern} onPress={() => navigation.navigate('QuranPdf')}>
                <Icon name="book-open-variant" size={28} color="#e6eaf3" />
                <Text style={styles.menuLabelModern}>{t('quran') || "Kur'an-ı Kerim"}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItemModern} onPress={() => navigation.navigate('Library')}>
                <Icon name="library" size={28} color="#e6eaf3" />
                <Text style={styles.menuLabelModern}>{t('library') || 'Kütüphane'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItemModern} onPress={() => navigation.navigate('AlarmSettings')}>
                <Icon name="alarm" size={28} color="#e6eaf3" />
                <Text style={styles.menuLabelModern}>{t('alarmSettings') || 'Alarm Ayarları'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItemModern} onPress={() => navigation.navigate('DiniGunler')}>
                <Icon name="calendar" size={28} color="#e6eaf3" />
                <Text style={styles.menuLabelModern}>{t('religiousDays') || 'Dini Günler'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItemModern} onPress={() => navigation.navigate('Hadis')}>
                <Icon name="book" size={28} color="#e6eaf3" />
                <Text style={styles.menuLabelModern}>{t('hadiths') || 'Hadisler'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItemModern} onPress={() => navigation.navigate('PdfLibraryScreen')}>
                <Icon name="book-open-page-variant" size={28} color="#e6eaf3" />
                <Text style={styles.menuLabelModern}>Kitaplar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  topBoxModern: {
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#1a2238',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 8,
    paddingHorizontal: 12,
  },
  countdownLabelModern: {
    fontSize: 18,
    color: '#FFEB3B',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  countdownModern: {
    fontSize: 40,
    color: '#FFEB3B',
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 4,
  },
  dateRowModern: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 8,
  },
  dateTextModern: {
    fontSize: 13,
    color: '#e6eaf3',
    fontWeight: 'bold',
    marginHorizontal: 4,
    textAlign: 'center',
  },
  vakitRowModern: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8, backgroundColor: '#1a2238', borderRadius: 12, paddingVertical: 4, paddingHorizontal: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8 },
  vakitItemModern: { flex: 1, alignItems: 'center', paddingVertical: 6, paddingHorizontal: 2, borderRadius: 8, backgroundColor: '#1a2238', marginHorizontal: 1, borderWidth: 2, borderColor: 'transparent', minWidth: 60 },
  activeVakitModern: {
    backgroundColor: '#fff',
    borderColor: '#FFEB3B',
    borderWidth: 4,
    shadowColor: '#FFEB3B',
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  vakitTimeModern: {
    fontSize: 16,
    color: '#e6eaf3',
    fontWeight: 'bold',
    marginTop: 2,
  },
  activeVakitTimeModern: {
    color: '#222',
    fontWeight: 'bold',
    textShadowColor: '#fffde7',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  vakitLabelModern: {
    fontSize: 12,
    color: '#e6eaf3',
    marginTop: 2,
  },
  activeVakitLabelModern: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 13,
    textShadowColor: '#fffde7',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  nextDaysBox: {
    backgroundColor: '#1a2238',
    borderRadius: 16,
    margin: 12,
    padding: 12,
  },
  nextDayCardModern: {
    backgroundColor: 'rgba(39,70,144,0.85)',
    borderRadius: 16,
    marginRight: 12,
    padding: 14,
    minWidth: 140,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  nextDayDateModern: {
    color: '#FFEB3B',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 6,
  },
  nextDayTimeModern: {
    color: '#e6eaf3',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 2,
    textAlign: 'center',
  },
  ayetBoxModern: {
    backgroundColor: '#274690',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  ayetArabicModern: {
    fontSize: 22,
    color: '#FFEB3B',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
  },
  ayetTranslationModern: {
    fontSize: 16,
    color: '#e6eaf3',
    textAlign: 'center',
    marginBottom: 4,
  },
  ayetRefModern: {
    fontSize: 14,
    color: '#FFEB3B',
    textAlign: 'center',
  },
  bottomBoxModern: {
    marginTop: 8,
    alignItems: 'center',
    paddingBottom: 16,
  },
  cityBarModern: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    paddingHorizontal: 12,
  },
  cityTextModern: {
    fontSize: 18,
    color: '#e6eaf3',
    fontWeight: 'bold',
    marginLeft: 6,
  },
  changeCityBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#274690',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
    marginTop: 4,
  },
  changeCityBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  menuRowModern: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  menuItemModern: {
    alignItems: 'center',
    flex: 1,
    padding: 2,
  },
  menuLabelModern: {
    fontSize: 11,
    color: '#e6eaf3',
    marginTop: 1,
    fontWeight: 'bold',
  },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 16 },
  modalContainer: { backgroundColor: '#0d1730', borderRadius: 12, padding: 12 },
  input: { flex: 1, backgroundColor: '#091025', color: '#fff', paddingHorizontal: 10, borderRadius: 8, height: 42 },
  addBtn: { backgroundColor: '#007AFF', paddingHorizontal: 12, justifyContent: 'center', alignItems: 'center', marginLeft: 8, borderRadius: 8 },
  savedCityRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, borderBottomColor: '#112032', borderBottomWidth: 1 },
  modalCloseBtn: { backgroundColor: '#33384a', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
});

export default HomeScreen;
