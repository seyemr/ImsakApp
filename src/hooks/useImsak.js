import { useState, useEffect } from 'react';
import { fetchImsakData } from '../api/imsakApi';
import { ImsakData } from '../types';

export const useImsak = (city: string) => {
  const [data, setData] = useState<ImsakData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchImsakData(city)
      .then((res) => setData(res))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [city]);

  return { data, loading, error };
};
