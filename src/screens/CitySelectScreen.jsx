import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { Text, Searchbar, ActivityIndicator } from 'react-native-paper';
import { cities } from '../utils/cities';
import { saveSelectedCity, getSelectedCity } from '../utils/storage';
import { useNavigation } from '@react-navigation/native';
import { useThemeContext } from '../context/ThemeContext';
import { useNotificationContext } from '../context/NotificationContext';

const CitySelectScreen = () => {
  const { themeColors } = useThemeContext();
  const { imsakNotif, aksamNotif } = useNotificationContext();
  const [search, setSearch] = useState('');
  const [filteredCities, setFilteredCities] = useState(cities);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    getSelectedCity().then((city) => {
      if (city) {
        navigation.reset({ index: 0, routes: [{ name: 'Ana Sayfa' }] });
      } else {
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    setFilteredCities(
      cities.filter((c) => c.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search]);

  const handleSelect = async (city) => {
    await saveSelectedCity(city);
    navigation.reset({ index: 0, routes: [{ name: 'Ana Sayfa' }] });
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 32 }} />;
  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: themeColors.background }}>
      <Searchbar
        placeholder="Şehir ara..."
        value={search}
        onChangeText={setSearch}
        style={{ marginBottom: 16 }}
      />
      <FlatList
        data={filteredCities}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleSelect(item)}
            style={{ padding: 16, borderBottomWidth: 0.5, borderColor: '#eee' }}
          >
            <Text style={{ fontSize: 16, color: themeColors.text }}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default CitySelectScreen;
