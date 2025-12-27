import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Text, TextInput, TouchableOpacity, Modal, FlatList } from 'react-native';
import Pdf from 'react-native-pdf';
import surahNamesTr from '../data/surahNames.tr.json';
import { surahPageMap } from '../data/quranPageMaps';

const TOTAL_PAGES = 604; // Mealin toplam sayfa sayısı (güncellenebilir)

export default function KuranMealiScreen() {
  const { width, height } = Dimensions.get('window');
  const [page, setPage] = useState(1);
  const [inputPage, setInputPage] = useState('');
  const [showSurahModal, setShowSurahModal] = useState(false);
  const [totalPages, setTotalPages] = useState(TOTAL_PAGES);

  // Sûre seçimi
  const goToSurah = (idx) => {
    setShowSurahModal(false);
    const surahPage = (surahPageMap[idx] || 1) + 64;
    setPage(Math.max(1, Math.min(surahPage, totalPages)));
  };

  // Sayfa numarasına git
  const goToInputPage = () => {
    const num = parseInt(inputPage, 10);
    if (!isNaN(num) && num >= 1 && num <= totalPages) {
      setPage(num);
      setInputPage('');
    }
  };

  // PDF sayfa değişiminde sınır kontrolü
  const handlePageChanged = (p) => {
    if (typeof p === 'number' && p >= 1 && p <= totalPages) {
      setPage(p);
    }
  };

  // PDF yüklendiğinde gerçek toplam sayfa sayısını al
  const handleLoadComplete = (n) => {
    if (typeof n === 'number' && n > 0) {
      setTotalPages(n);
      if (page > n) setPage(n);
    }
  };

  return (
    <View style={styles.container}>
      <Pdf
        source={require('../../assets/meal.pdf')}
        style={{ width: width, height: height - 60 }}
        trustAllCerts={false}
        enablePaging={false}
        horizontal={false}
        fitPolicy={0}
        scale={1}
        minScale={1}
        maxScale={1.35}
        enablePinchZoom={true}
        spacing={0}
        enableAnnotationRendering={false}
        enableAntialiasing={true}
        page={page}
        onLoadComplete={handleLoadComplete}
      />
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomBtn} onPress={() => setShowSurahModal(true)}>
          <Text style={styles.bottomBtnText}>Sûre Bul</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.pageInput}
          value={inputPage}
          onChangeText={setInputPage}
          placeholder="Sayfa"
          placeholderTextColor="#888"
          keyboardType="number-pad"
          maxLength={4}
          onSubmitEditing={goToInputPage}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.bottomBtn} onPress={goToInputPage}>
          <Text style={styles.bottomBtnText}>Git</Text>
        </TouchableOpacity>
        <Text style={styles.pageNum}>{page}/{totalPages}</Text>
      </View>
      <Modal visible={showSurahModal} animationType="slide" onRequestClose={() => setShowSurahModal(false)}>
        <FlatList
          data={surahNamesTr}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity style={styles.modalItem} onPress={() => goToSurah(index)}>
              <Text style={styles.modalText}>{index + 1}. {item}</Text>
            </TouchableOpacity>
          )}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1220',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: 'rgba(18,22,34,0.92)',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  bottomBtn: {
    backgroundColor: '#274690',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginHorizontal: 4,
  },
  bottomBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  pageInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    width: 60,
    textAlign: 'center',
    fontSize: 15,
    color: '#232a3b',
    marginHorizontal: 4,
  },
  pageNum: {
    color: '#e0e6f7',
    fontSize: 15,
    marginLeft: 8,
    fontWeight: '500',
  },
  modalItem: {
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalText: {
    fontSize: 18,
    color: '#222',
  },
});
