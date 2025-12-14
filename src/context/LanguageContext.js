import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LANG_KEY = 'app_language';
const defaultLang = 'tr';

export const LanguageContext = createContext({
  lang: defaultLang,
  setLang: () => {},
  t: (key) => key,
});

const translations = {
  tr: {
    settings: 'Ayarlar',
    theme: 'Tema',
    light: 'Açık',
    dark: 'Koyu',
    notifications: 'Bildirimler',
    imsakNotif: 'İmsak Bildirimi',
    aksamNotif: 'Akşam Bildirimi',
    resetCity: 'Şehri Sıfırla',
    cityReset: 'Şehir sıfırlandı',
    goHome: 'Ana ekrana yönlendirileceksiniz.',
    readMore: 'Devamını oku',
    close: 'Kapat',
    hadiths: 'Hadisler',
    surahs: 'Sûreler',
    library: 'Kütüphane',
    search: 'Ara',
    alarmSettings: 'Alarm Ayarları',
    day: 'Gün',
    delete: 'Sil',
    add: 'Ekle',
    selectCity: 'Şehir Seçiniz',
    selectCityTitle: 'Şehir Seç',
    times: 'Vakitler',
    monthlyImsakiye: 'Aylık İmsakiye',
    home: 'Anasayfa',
    loading: 'Yükleniyor...',
    searchFailed: 'Arama başarısız.',
    booksFailed: 'Kitaplar alınamadı.',
    messagePlaceholder: 'Mesaj yaz…',
    today: 'Bugün',
    imsak: 'İmsak',
    gunes: 'Güneş',
    ogle: 'Öğle',
    ikindi: 'İkindi',
    aksam: 'Akşam',
    yatsi: 'Yatsı',
    ayetSearch: 'Ayet ara...',
    surahSearch: 'Sûre ara...',
    bookSearch: 'Kitap ara...',
    authorUnknown: 'Yazar Bilgisi Yok',
    unnamedBook: 'İsimsiz Kitap',
    quran: "Kur'an-ı Kerim",
    religiousDays: 'Dini Günler',
    // ...diğer anahtarlar
  },
  en: {
    settings: 'Settings',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    notifications: 'Notifications',
    imsakNotif: 'Imsak Notification',
    aksamNotif: 'Maghrib Notification',
    resetCity: 'Reset City',
    cityReset: 'City reset',
    goHome: 'You will be redirected to home.',
    readMore: 'Read more',
    close: 'Close',
    hadiths: 'Hadiths',
    surahs: 'Surahs',
    library: 'Library',
    search: 'Search',
    alarmSettings: 'Alarm Settings',
    day: 'Day',
    delete: 'Delete',
    add: 'Add',
    selectCity: 'Select City',
    selectCityTitle: 'Select City',
    times: 'Prayer Times',
    monthlyImsakiye: 'Monthly Imsakiye',
    home: 'Home',
    loading: 'Loading...',
    searchFailed: 'Search failed.',
    booksFailed: 'Failed to fetch books.',
    messagePlaceholder: 'Type a message…',
    today: 'Today',
    imsak: 'Imsak',
    gunes: 'Sunrise',
    ogle: 'Dhuhr',
    ikindi: 'Asr',
    aksam: 'Maghrib',
    yatsi: 'Isha',
    ayetSearch: 'Search ayah...',
    surahSearch: 'Search surah...',
    bookSearch: 'Search book...',
    authorUnknown: 'Unknown Author',
    unnamedBook: 'Untitled Book',
    // ...other keys
  },
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(defaultLang);

  useEffect(() => {
    AsyncStorage.getItem(LANG_KEY).then(l => { if (l) setLangState(l); });
  }, []);

  const setLang = async (l) => {
    setLangState(l);
    await AsyncStorage.setItem(LANG_KEY, l);
  };

  const t = (key) => translations[lang]?.[key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
