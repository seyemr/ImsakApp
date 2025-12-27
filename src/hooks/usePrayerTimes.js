import { useState, useEffect } from 'react';
import { fetchPrayerTimes } from '../api/imsakiye';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = 'prayer_times_';

export const usePrayerTimes = (city) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const normCity = city?.toLowerCase();
    const cacheKey = `${CACHE_PREFIX}${normCity}`;

    // 1. Önce local cache'den oku ve göster
    const loadFromCache = async () => {
      try {
        const cached = await AsyncStorage.getItem(cacheKey);
        if (cached) {
          const { data: cachedData } = JSON.parse(cached);
          if (isMounted) {
            setData(cachedData);
            setLoading(false); // Hızlıca göster
          }
        }
      } catch (e) {
        // Cache okuma hatası
      }
    };

    // 2. Sonra API'den güncelle ve local'i yenile
    const fetchAndUpdate = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchPrayerTimes(city);
        if (!res || res.error || !res.data) {
          if (isMounted) {
            setError(
              'Sunucu beklenmeyen bir yanıt döndürdü.' +
              (res && res.error ? ' Hata: ' + res.error : '') +
              (typeof res === 'string' ? ' Yanıt: ' + res : '')
            );
          }
        } else {
          if (isMounted) {
            setData(res);
            setError(null);
          }
        }
      } catch (err) {
        // API hatası, local veri varsa onu göster
        if (isMounted) {
          setError('İstek hatası: ' + (err?.message || err));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadFromCache().then(fetchAndUpdate);
    return () => { isMounted = false; };
  }, [city]);

  return { data, loading, error };
};
