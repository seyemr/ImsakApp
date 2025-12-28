import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './navigation/TabNavigator';
import CitySelectScreen from './screens/CitySelectScreen';
import SurahListScreen from './screens/SurahListScreen';
import SurahDetailScreen from './screens/SurahDetailScreen';
import SurahArabicScreen from './screens/SurahArabicScreen';
import SurahMealScreen from './screens/SurahMealScreen';
import LibraryScreen from './screens/LibraryScreen';
import BookDetailScreen from './screens/BookDetailScreen';
import HadisScreen from './screens/HadisScreen';
import KuranPdfScreen from './screens/KuranPdfScreen';
import KuranMealiScreen from './screens/KuranMealiScreen';
import DualarScreen from './screens/DualarScreen';
import WidgetPreview from './components/WidgetPreview';
import { AppDarkTheme, AppLightTheme } from './utils/theme';
import { useColorScheme } from 'react-native';
import ZikirmatikScreen from './screens/ZikirmatikScreen';
import PdfLibraryScreen from './screens/PdfLibraryScreen';
import AliyyaPdfScreen from './screens/AliyyaPdfScreen';
import MevdudiPdfScreen from './screens/MevdudiPdfScreen';
import RiyazusSalihinPdfScreen from './screens/RiyazusSalihinPdfScreen';
import Ogutler1PdfScreen from './screens/Ogutler1PdfScreen';
import Ogutler2PdfScreen from './screens/Ogutler2PdfScreen';
import RasimPdfScreen from './screens/RasimPdfScreen';
import SiyerPdfScreen from './screens/SiyerPdfScreen';
import KuranOkuAnlaYasaPdfScreen from './screens/KuranOkuAnlaYasaPdfScreen';
import YoldakiIsaretlerPdfScreen from './screens/YoldakiIsaretlerPdfScreen';
import MealPdfScreen from './screens/MealPdfScreen';
import KirkAyetPdfScreen from './screens/KirkAyetPdfScreen';
import KuranKerimMealiPdfScreen from './screens/KuranKerimMealiPdfScreen';
import SplashScreen from './screens/SplashScreen';

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? AppDarkTheme : AppLightTheme;
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen name="CitySelect" component={CitySelectScreen} />
        <Stack.Screen name="SurahList" component={SurahListScreen} />
        <Stack.Screen name="SurahDetail" component={SurahDetailScreen} />
        <Stack.Screen name="SurahArabic" component={SurahArabicScreen} />
        <Stack.Screen name="SurahMeal" component={SurahMealScreen} />
        <Stack.Screen name="Library" component={LibraryScreen} />
        <Stack.Screen name="BookDetail" component={BookDetailScreen} />
        <Stack.Screen name="Hadis" component={HadisScreen} />
        <Stack.Screen name="KuranPdf" component={KuranPdfScreen} />
        <Stack.Screen name="KuranMeali" component={KuranMealiScreen} />
        <Stack.Screen name="Dualar" component={DualarScreen} />
        <Stack.Screen name="WidgetPreview" component={WidgetPreview} />
        <Stack.Screen name="Zikirmatik" component={ZikirmatikScreen} options={{ animation: 'fade_from_bottom', presentation: 'card' }} />
        <Stack.Screen name="PdfLibraryScreen" component={PdfLibraryScreen} options={{ title: 'PDF Kütüphanesi' }} />
        {/* PDF özel ekranları */}
        <Stack.Screen name="AliyyaPdfScreen" component={AliyyaPdfScreen} />
        <Stack.Screen name="MevdudiPdfScreen" component={MevdudiPdfScreen} />
        <Stack.Screen name="RiyazusSalihinPdfScreen" component={RiyazusSalihinPdfScreen} />
        <Stack.Screen name="Ogutler1PdfScreen" component={Ogutler1PdfScreen} />
        <Stack.Screen name="Ogutler2PdfScreen" component={Ogutler2PdfScreen} />
        <Stack.Screen name="RasimPdfScreen" component={RasimPdfScreen} />
        <Stack.Screen name="SiyerPdfScreen" component={SiyerPdfScreen} />
        <Stack.Screen name="KuranOkuAnlaYasaPdfScreen" component={KuranOkuAnlaYasaPdfScreen} />
        <Stack.Screen name="YoldakiIsaretlerPdfScreen" component={YoldakiIsaretlerPdfScreen} />
        <Stack.Screen name="KuranPdfScreen" component={KuranPdfScreen} />
        <Stack.Screen name="MealPdfScreen" component={MealPdfScreen} />
        <Stack.Screen name="KirkAyetPdfScreen" component={KirkAyetPdfScreen} />
        <Stack.Screen name="KuranKerimMealiPdfScreen" component={KuranKerimMealiPdfScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
