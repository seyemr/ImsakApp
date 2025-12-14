import axios from 'axios';

const API_BASE_URL = 'https://api.example.com'; // Değiştirilecek

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const fetchImsakData = async (city: string) => {
  // API endpoint örnek
  const response = await api.get(`/imsak?city=${encodeURIComponent(city)}`);
  return response.data;
};
