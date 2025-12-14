import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import MonthlyScreen from '../screens/MonthlyScreen';
import SettingsScreen from '../screens/SettingsScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useColorScheme } from 'react-native';
import { AppDarkTheme, AppLightTheme } from '../utils/theme';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? AppDarkTheme.colors : AppLightTheme.colors;
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.text,
        tabBarStyle: { backgroundColor: theme.background },
        tabBarIcon: ({ color, size }) => {
          let iconName = '';
          if (route.name === 'Anasayfa') iconName = 'home';
          else if (route.name === 'Aylık İmsakiye') iconName = 'calendar';
          else if (route.name === 'Ayarlar') iconName = 'cog';
          return <Icon name={iconName} color={color} size={size} />;
        },
      })}
    >
      <Tab.Screen name="Anasayfa" component={HomeScreen} />
      <Tab.Screen name="Aylık İmsakiye" component={MonthlyScreen} />
      <Tab.Screen name="Ayarlar" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
