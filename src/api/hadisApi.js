import axios from 'axios';

// Fawaz Ahmed Hadith API (tek dosya, Türkçe, Sahih Buhari)
const HADIS_API_URL = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/tur-bukhari.json';

let cachedHadiths = null;

export async function getRandomHadisFromApi() {
  try {
    if (!cachedHadiths) {
      const res = await fetch(HADIS_API_URL);
      const data = await res.json();
      // API'den dönen veri yapısı: { hadiths: [ ... ] } veya { hadiths: { ... } }
      if (data && data.hadiths) {
        if (Array.isArray(data.hadiths)) {
          cachedHadiths = data.hadiths.filter(h => h.text && typeof h.text === 'string' && h.text.trim().length > 0);
        } else if (typeof data.hadiths === 'object') {
          cachedHadiths = Object.values(data.hadiths).filter(h => h.text && typeof h.text === 'string' && h.text.trim().length > 0);
        }
      }
      if (!cachedHadiths || cachedHadiths.length === 0) return null;
    }
    const hadis = cachedHadiths[Math.floor(Math.random() * cachedHadiths.length)];
    return {
      text: typeof hadis.text === 'string' ? hadis.text : JSON.stringify(hadis.text),
      source: typeof hadis.reference === 'string' ? hadis.reference : ''
    };
  } catch (e) {
    return null;
  }
}
