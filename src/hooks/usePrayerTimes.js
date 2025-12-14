import { useState, useEffect } from 'react';
import { fetchPrayerTimes } from '../api/imsakiye';

export const usePrayerTimes = (city) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchPrayerTimes(city)
      .then((res) => {
        if (!res || res.error || !res.data) {
          setError(
            'Sunucu beklenmeyen bir yanıt döndürdü.' +
            (res && res.error ? ' Hata: ' + res.error : '') +
            (typeof res === 'string' ? ' Yanıt: ' + res : '')
          );
          setData(null);
        } else {
          setData(res);
        }
      })
      .catch((err) => setError('İstek hatası: ' + (err?.message || err)))
      .finally(() => setLoading(false));
  }, [city]);

  return { data, loading, error };
};
