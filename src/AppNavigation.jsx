import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './navigation/TabNavigator';
import CitySelectScreen from './screens/CitySelectScreen';
import ChatScreen from './screens/ChatScreen';
import SurahListScreen from './screens/SurahListScreen';
import SurahDetailScreen from './screens/SurahDetailScreen';
import AlarmSettingsScreen from './screens/AlarmSettingsScreen';
import DiniGunlerScreen from './screens/DiniGunlerScreen';
import SurahArabicScreen from './screens/SurahArabicScreen';
import SurahMealScreen from './screens/SurahMealScreen';
import LibraryScreen from './screens/LibraryScreen';
import BookDetailScreen from './screens/BookDetailScreen';
import HadisScreen from './screens/HadisScreen';
import { AppDarkTheme, AppLightTheme } from './utils/theme';
import { useColorScheme } from 'react-native';

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? AppDarkTheme : AppLightTheme;
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen name="CitySelect" component={CitySelectScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="SurahList" component={SurahListScreen} />
        <Stack.Screen name="SurahDetail" component={SurahDetailScreen} />
        <Stack.Screen name="AlarmSettings" component={AlarmSettingsScreen} />
        <Stack.Screen name="DiniGunler" component={DiniGunlerScreen} />
        <Stack.Screen name="SurahArabic" component={SurahArabicScreen} />
        <Stack.Screen name="SurahMeal" component={SurahMealScreen} />
        <Stack.Screen name="Library" component={LibraryScreen} />
        <Stack.Screen name="BookDetail" component={BookDetailScreen} />
        <Stack.Screen name="Hadis" component={HadisScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
