import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, Pressable } from 'react-native';
import { cities } from '../utils/cities';
import { saveSelectedCity, getSelectedCity } from '../utils/storage';
import { useLanguage } from '../context/LanguageContext';

const CitySelector = ({ onSelect }) => {
  const [selectedCity, setSelectedCity] = useState(cities[0]);
  const [modalVisible, setModalVisible] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    getSelectedCity().then((city) => {
      if (city) setSelectedCity(city);
    });
  }, []);

  const handleSelect = async (city) => {
    setSelectedCity(city);
    await saveSelectedCity(city);
    onSelect(city);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('selectCity')}:</Text>
      <TouchableOpacity
        style={styles.selectorButton}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.selectorButtonText}>{selectedCity}</Text>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('selectCityTitle')}</Text>
            <FlatList
              data={cities}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  style={({ pressed }) => [
                    styles.cityItem,
                    item === selectedCity && styles.selectedCityItem,
                    pressed && styles.pressedCityItem,
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={[styles.cityText, item === selectedCity && styles.selectedCityText]}>{item}</Text>
                  {item === selectedCity && <Text style={styles.checkMark}>✓</Text>}
                </Pressable>
              )}
              contentContainerStyle={{ paddingBottom: 16 }}
              showsVerticalScrollIndicator={false}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>{t('close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { margin: 8, minWidth: 160 },
  label: { fontWeight: 'bold', marginBottom: 4, color: '#223366', fontSize: 13 },
  selectorButton: {
    backgroundColor: '#d32f2f',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
    elevation: 2,
    flexDirection: 'row',
  },
  selectorButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    width: 320,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    alignItems: 'stretch',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#d32f2f',
    marginBottom: 12,
    textAlign: 'center',
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 2,
  },
  selectedCityItem: {
    backgroundColor: '#fbe9e7',
  },
  pressedCityItem: {
    backgroundColor: '#ffeaea',
  },
  cityText: {
    flex: 1,
    fontSize: 16,
    color: '#223366',
    fontWeight: '500',
  },
  selectedCityText: {
    color: '#d32f2f',
    fontWeight: '700',
  },
  checkMark: {
    fontSize: 18,
    color: '#d32f2f',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#d32f2f',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});

export default CitySelector;
