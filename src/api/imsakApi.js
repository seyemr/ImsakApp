import axios from 'axios';

const API_BASE_URL = 'https://api.example.com'; // Gerçek API adresi ile değiştirin

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const fetchImsakData = async (city) => {
  try {
    const response = await api.get(`/imsak?city=${encodeURIComponent(city)}`);
    if (!response.data) throw new Error('API boş veri döndürdü');
    return response.data;
  } catch (error) {
    let msg = error?.response?.data?.message || error.message || 'Bir hata oluştu';
    throw new Error(msg);
  }
};
