import AsyncStorage from '@react-native-async-storage/async-storage';

const SELECTED_CITY_KEY = 'selected_city';

export const saveSelectedCity = async (city: string) => {
  try {
    await AsyncStorage.setItem(SELECTED_CITY_KEY, city);
  } catch (e) {
    // handle error
  }
};

export const getSelectedCity = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(SELECTED_CITY_KEY);
  } catch (e) {
    return null;
  }
};
