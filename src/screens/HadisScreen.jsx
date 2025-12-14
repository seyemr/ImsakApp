import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { getRandomHadisFromApi } from '../api/hadisApi';
import { useLanguage } from '../context/LanguageContext';
import { useThemeContext } from '../context/ThemeContext';
import { useNotificationContext } from '../context/NotificationContext';

const MAX_LENGTH = 220;

export default function HadisScreen() {
  const { themeColors } = useThemeContext();
  const { imsakNotif, aksamNotif } = useNotificationContext();
  const [hadisler, setHadisler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedHadis, setSelectedHadis] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    async function loadHadisler() {
      setLoading(true);
      // 10 rastgele hadis getir
      const arr = [];
      for (let i = 0; i < 10; i++) {
        const h = await getRandomHadisFromApi();
        if (h) arr.push(h);
      }
      setHadisler(arr);
      setLoading(false);
    }
    loadHadisler();
  }, []);

  const handleReadMore = (hadis) => {
    setSelectedHadis(hadis);
    setModalVisible(true);
  };

  if (loading) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: themeColors.background }}><ActivityIndicator size="large" color="#FFEB3B" /><Text style={{ color: themeColors.text }}>{t('loading')}</Text></View>;

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background, padding: 16 }}>
      <Text style={{ color: '#FFEB3B', fontWeight: 'bold', fontSize: 20, textAlign: 'center', marginBottom: 16 }}>{t('hadiths')}</Text>
      <FlatList
        data={hadisler}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item }) => {
          const isLong = item.text.length > MAX_LENGTH;
          const preview = isLong ? item.text.slice(0, MAX_LENGTH) + '...' : item.text;
          return (
            <View style={{ backgroundColor: '#274690', borderRadius: 14, marginBottom: 14, padding: 14 }}>
              <Text style={{ color: '#fff', fontSize: 16, marginBottom: 6 }}>{preview}</Text>
              {isLong && (
                <TouchableOpacity onPress={() => handleReadMore(item)}>
                  <Text style={{ color: '#FFEB3B', fontWeight: 'bold', marginBottom: 6 }}>{t('readMore')}</Text>
                </TouchableOpacity>
              )}
              <Text style={{ color: '#FFEB3B', fontSize: 13 }}>{item.source}</Text>
            </View>
          );
        }}
      />
      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 24 }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 18, padding: 18, maxHeight: '80%' }}>
            <ScrollView>
              <Text style={{ color: '#222', fontSize: 17, marginBottom: 12 }}>{selectedHadis?.text}</Text>
              <Text style={{ color: '#274690', fontSize: 14, marginBottom: 18 }}>{selectedHadis?.source}</Text>
            </ScrollView>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={{ alignSelf: 'center', marginTop: 8, backgroundColor: '#274690', borderRadius: 8, paddingHorizontal: 18, paddingVertical: 8 }}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>{t('close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
