import AsyncStorage from '@react-native-async-storage/async-storage';

const QURAN_PROGRESS_KEY = 'quran_progress';

export async function saveQuranProgress(page) {
  await AsyncStorage.setItem(QURAN_PROGRESS_KEY, String(page));
}

export async function getQuranProgress() {
  const page = await AsyncStorage.getItem(QURAN_PROGRESS_KEY);
  return page ? Number(page) : 1;
}
