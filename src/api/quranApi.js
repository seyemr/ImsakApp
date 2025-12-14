import axios from 'axios';

const API_URL = 'https://api.alquran.cloud/v1';
const QURAN_API = 'https://api.quran.com/api/v4';

export const getSurahList = async () => {
  try {
    const res = await axios.get(`${API_URL}/surah`);
    return res.data.data;
  } catch (e) {
    throw new Error('Sure listesi alınırken hata oluştu');
  }
};

export const getSurah = async (number) => {
  try {
    const res = await axios.get(`${API_URL}/surah/${number}/tr.diyanet`);
    return res.data.data;
  } catch (e) {
    throw new Error('Sûre alınırken hata oluştu');
  }
};

export const getAyah = async (key) => {
  try {
    const res = await axios.get(`${API_URL}/ayah/${key}/tr.diyanet`);
    return res.data.data;
  } catch (e) {
    throw new Error('Ayet alınırken hata oluştu');
  }
};

// Quran.com API
export async function getSurahArabic(surahId) {
  try {
    const res = await axios.get(`${QURAN_API}/quran/verses/uthmani?chapter_number=${surahId}`);
    if (!res.data || !Array.isArray(res.data.verses)) {
      throw new Error('Ayetler alınamadı veya beklenen formatta değil.');
    }
    return res.data.verses;
  } catch (e) {
    console.log('QURAN API ARABIC ERROR:', e);
    throw new Error('Ayetler alınamadı. (API)');
  }
}

export async function getSurahInfo(surahId) {
  try {
    const res = await axios.get(`${QURAN_API}/chapters/${surahId}`);
    if (!res.data || !res.data.chapter) {
      throw new Error('Sûre bilgisi alınamadı veya beklenen formatta değil.');
    }
    return res.data.chapter;
  } catch (e) {
    console.log('QURAN API INFO ERROR:', e);
    throw new Error('Sûre bilgisi alınamadı. (API)');
  }
}

export async function getSurahTurkish(surahId) {
  // Returns array of ayahs in Turkish (alternative translation)
  // Try ID 497 (Elmalılı Hamdi Yazır)
  try {
    const res = await axios.get(`${QURAN_API}/quran/translations/497?chapter_number=${surahId}`);
    console.log('QURAN API TURKISH RAW RESPONSE:', res.data);
    // Try to return translations array, fallback to other possible keys
    if (Array.isArray(res.data.translations) && res.data.translations.length > 0) {
      return res.data.translations;
    }
    // Try verses or other keys if translations is empty
    if (Array.isArray(res.data.verses) && res.data.verses.length > 0) {
      return res.data.verses;
    }
    // Fallback: return empty array
    return [];
  } catch (e) {
    console.log('QURAN API TURKISH ERROR:', e);
    return [];
  }
}
