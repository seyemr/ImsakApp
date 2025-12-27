import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://api.aladhan.com/v1/timingsByCity';
const COUNTRY = 'Turkey';
const METHOD = 13;
const CACHE_PREFIX = 'prayer_times_';
const CACHE_DURATION = 60 * 60 * 1000; // 1 saat (ms)

const getCacheKey = (city) => `${CACHE_PREFIX}${city.toLowerCase()}`;

export const fetchPrayerTimes = async (city) => {
  const cacheKey = getCacheKey(city);
  try {
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data;
      }
    }
  } catch (e) {
    // Cache okuma hatası
  }

  try {
    const response = await axios.get(API_URL, {
      params: { city, country: COUNTRY, method: METHOD },
      responseType: 'json',
      validateStatus: () => true, // Her durumda response al
    });
    let data = response.data;
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) {
        console.log('API ERROR: Yanıt JSON değil:', response.status, response.data);
        throw new Error('API yanıtı JSON formatında değil. HTTP Status: ' + response.status);
      }
    }
    if (!data || typeof data !== 'object') {
      console.log('API ERROR: Beklenmeyen veri:', response.status, response.data);
      throw new Error('API beklenmeyen bir veri döndürdü. HTTP Status: ' + response.status);
    }
    await AsyncStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
    return data;
  } catch (error) {
    let errorMsg = 'Bir hata oluştu';
    if (error.response) {
      console.log('API ERROR:', error.response.status, error.response.data);
      errorMsg =
        (error.response.data && (error.response.data.data || error.response.data.status)) ||
        error.message ||
        'Bir hata oluştu';
      if (error.response.status) {
        errorMsg += ' (HTTP Status: ' + error.response.status + ')';
      }
    } else {
      console.log('API ERROR:', error.message);
      errorMsg = error.message || 'Bir hata oluştu';
    }
    throw new Error(errorMsg);
  }
};

const CALENDAR_API_URL = 'https://api.aladhan.com/v1/calendarByCity';

export const fetchMonthlyPrayerTimes = async (city, month, year) => {
  try {
    const response = await axios.get(CALENDAR_API_URL, {
      params: {
        city,
        country: COUNTRY,
        method: METHOD,
        month,
        year,
      },
      responseType: 'json',
      validateStatus: () => true,
    });
    let data = response.data;
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) {
        console.log('API ERROR: Yanıt JSON değil:', response.status, response.data);
        throw new Error('API yanıtı JSON formatında değil. HTTP Status: ' + response.status);
      }
    }
    if (!data || typeof data !== 'object' || !Array.isArray(data.data)) {
      console.log('API ERROR: Beklenmeyen veri:', response.status, response.data);
      throw new Error('Aylık imsakiye verisi alınamadı. HTTP Status: ' + response.status);
    }
    return data.data;
  } catch (error) {
    let errorMsg = 'Bir hata oluştu';
    if (error.response) {
      console.log('API ERROR:', error.response.status, error.response.data);
      errorMsg =
        (error.response.data && (error.response.data.data || error.response.data.status)) ||
        error.message ||
        'Bir hata oluştu';
      if (error.response.status) {
        errorMsg += ' (HTTP Status: ' + error.response.status + ')';
      }
    } else {
      console.log('API ERROR:', error.message);
      errorMsg = error.message || 'Bir hata oluştu';
    }
    throw new Error(errorMsg);
  }
};
