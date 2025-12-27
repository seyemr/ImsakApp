import React, { useRef, useState, useCallback } from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity, Modal, FlatList, ActivityIndicator, TextInput, Platform } from 'react-native';
import Pdf from 'react-native-pdf';
import { useThemeContext } from '../context/ThemeContext';
import surahNamesTr from '../data/surahNames.tr.json';
// import { juzPageMap, surahPageMap } from '../data/quranPageMaps';
import { useRoute } from '@react-navigation/native';

const TOTAL_PAGES = 675;

// PDF dosyalarını statik olarak eşleştir (doğru klasör: assets/)
const pdfAssets = {
  'meal.pdf': require('../../assets/meal.pdf'),
  'Riyazus_Salihin.pdf': require('../../assets/Riyazus_Salihin.pdf'),
  'mevdudi.pdf': require('../../assets/mevdudi.pdf'),
  'aliyya.pdf': require('../../assets/aliyya.pdf'),
  'ogutler_1.pdf': require('../../assets/ogutler_1.pdf'),
  'ogutler_2.pdf': require('../../assets/ogutler_2.pdf'),
  'rasim.pdf': require('../../assets/rasim.pdf'),
  'siyer.pdf': require('../../assets/siyer.pdf'),
  '40AyetteKuran.pdf': require('../../assets/40AyetteKuran.pdf'),
  'KuranOkuAnlaYasa.pdf': require('../../assets/KuranOkuAnlaYasa.pdf'),
  'Yoldaki_Isaretler.pdf': require('../../assets/Yoldaki_Isaretler.pdf'),
  'kuran.pdf': require('../../assets/kuran.pdf'),
};

export default function QuranPdfScreen() {
  const route = useRoute();
  const { themeColors } = useThemeContext();
  const pdfRef = useRef();
  const [page, setPage] = useState(1);
  const [showSurahModal, setShowSurahModal] = useState(false);
  const [showJuzModal, setShowJuzModal] = useState(false);
  const [pdfPageCount, setPdfPageCount] = useState(TOTAL_PAGES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inputPage, setInputPage] = useState('');
  const [scale, setScale] = useState(1.0); // PDF zoom seviyesi
  // PDF kaynağı ve denenen yolları state ile yönet
  const [androidSourceType, setAndroidSourceType] = useState('file'); // 'file' veya 'bundle'
  // PDF dosya adı navigation parametresinden alınır, yoksa kuran.pdf açılır
  const pdfFile = route.params?.pdfFile || 'kuran.pdf';
  let source;
  let sourceLabel = pdfFile;
  if (Platform.OS === 'android') {
    if (androidSourceType === 'file') {
      source = { uri: `file:///android_asset/${pdfFile}` };
      sourceLabel = `file:///android_asset/${pdfFile}`;
    } else {
      source = { uri: `bundle-assets://${pdfFile}` };
      sourceLabel = `bundle-assets://${pdfFile}`;
    }
  } else {
    source = pdfAssets[pdfFile] || pdfAssets['kuran.pdf'];
    sourceLabel = pdfFile;
  }

  const goToPage = (p) => {
    if (p < 1 || p > pdfPageCount) return;
    setPage(p);
    pdfRef.current?.setPage(p);
  };

  const goToSurah = (idx) => {
    setShowSurahModal(false);
    const surahPage = surahPageMap[idx] || 1;
    goToPage(surahPage);
  };
  const goToJuz = (idx) => {
    setShowJuzModal(false);
    const juzPage = juzPageMap[idx] || 1;
    goToPage(juzPage);
  };

  const onLoadComplete = (n) => {
    setPdfPageCount(n);
    setLoading(false);
    setError(null);
  };
  const onPdfError = (err) => {
    if (Platform.OS === 'android' && androidSourceType === 'file') {
      // file:///android_asset/ ile hata olursa bundle-assets:// ile tekrar dene
      setAndroidSourceType('bundle');
      setLoading(true);
      setTimeout(() => setLoading(false), 500); // yeniden yüklemeyi tetikle
    } else {
      setLoading(false);
      setError('Kur’an dosyası yüklenemedi veya bozuk. Lütfen tekrar deneyin.\n' + (err?.message || ''));
    }
  };
  const retry = () => {
    setError(null);
    setLoading(true);
    setAndroidSourceType('file'); // Baştan başla
    goToPage(1);
  };
  const goToInputPage = () => {
    const num = parseInt(inputPage, 10);
    if (!isNaN(num) && num >= 1 && num <= pdfPageCount) {
      goToPage(num);
      setInputPage('');
    }
  };

  // PDF kaynağı değiştiğinde Pdf bileşenini yeniden render etmek için key kullan
  const pdfKey = Platform.OS === 'android' ? `${pdfFile}-${androidSourceType}-${scale}` : `${pdfFile}-${scale}`;

  // Büyütme/küçültme fonksiyonları
  const zoomIn = () => setScale((s) => Math.min(s + 0.2, 3));
  const zoomOut = () => setScale((s) => Math.max(s - 0.2, 0.5));

  return (
    <View style={styles.container}>
      
      {error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={retry}>
            <Text style={styles.retryBtnText}>Tekrar Dene</Text>
          </TouchableOpacity>
        </View>
      ) : loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#274690" />
          <Text style={styles.loadingText}>Kur’an yükleniyor...</Text>
        </View>
      ) : null}
      <View style={styles.pdfWrapper} pointerEvents="box-none">
        <Pdf
          key={pdfKey}
          ref={pdfRef}
          source={source}
          style={styles.pdf}
          trustAllCerts={false}
          enablePaging={false}
          horizontal={false}
          fitPolicy={0} // fitPolicy=0: BOTH, her taraftan orantılı büyütme
          scale={scale}
          minScale={0.3}
          maxScale={1.35}
          enablePinchZoom={true} // iki parmakla zoom aktif
          spacing={0}
          enableAnnotationRendering={false}
          enableAntialiasing={true}
          onPageChanged={() => {}}
          page={page}
          onLoadComplete={(n) => { onLoadComplete(n); console.log('PDF loaded', n); }}
          onError={(err) => { onPdfError(err); console.log('PDF error', err); }}
        />
      </View>
      {!error && !loading && (
        <View style={styles.bottomBarMinimal}>
          <TouchableOpacity
            onPress={() => goToPage(page - 1)}
            style={[styles.iconBtnMinimal, page === 1 && styles.iconBtnDisabled]}
            disabled={page === 1}
            activeOpacity={0.7}
          >
            <Text style={[styles.iconMinimal, page === 1 && { opacity: 0.3 }]}>⟨</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowSurahModal(true)}
            style={styles.iconBtnMinimal}
            activeOpacity={0.7}
          >
            <Text style={styles.iconMinimal}>Sure</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowJuzModal(true)}
            style={styles.iconBtnMinimal}
            activeOpacity={0.7}
          >
            <Text style={styles.iconMinimal}>Cüz</Text>
          </TouchableOpacity>
          <Text style={styles.pageNumMinimal}>{page}/{pdfPageCount}</Text>
          <TextInput
            style={styles.pageInputMinimal}
            value={inputPage}
            onChangeText={setInputPage}
            placeholder="Sayfa"
            placeholderTextColor="#888"
            keyboardType="number-pad"
            maxLength={4}
            onSubmitEditing={goToInputPage}
            returnKeyType="done"
          />
          <TouchableOpacity onPress={goToInputPage} style={styles.iconBtnMinimal} activeOpacity={0.7}>
            <Text style={styles.iconMinimal}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => goToPage(page + 1)}
            style={[styles.iconBtnMinimal, page === pdfPageCount && styles.iconBtnDisabled]}
            disabled={page === pdfPageCount}
            activeOpacity={0.7}
          >
            <Text style={[styles.iconMinimal, page === pdfPageCount && { opacity: 0.3 }]}>⟩</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={zoomOut} style={styles.iconBtnMinimal} activeOpacity={0.7}>
            <Text style={styles.iconMinimal}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={zoomIn} style={styles.iconBtnMinimal} activeOpacity={0.7}>
            <Text style={styles.iconMinimal}>+</Text>
          </TouchableOpacity>
        </View>
      )}
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
      <Modal visible={showJuzModal} animationType="slide" onRequestClose={() => setShowJuzModal(false)}>
        <FlatList
          data={Array.from({ length: 30 }, (_, i) => `Cüz ${i + 1}`)}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity style={styles.modalItem} onPress={() => goToJuz(index)}>
              <Text style={styles.modalText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </Modal>
    </View>
  );
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1220',
  },
  pdf: {
    flex: 1,
    width: width,
    height: height,
  },
  pdfWrapper: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 0,
    backgroundColor: '#0b1220',
    marginBottom: 0,
  },
  bottomBarMinimal: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 6,
    backgroundColor: 'rgba(18,22,34,0.92)', // daha koyu ve opak
    position: 'absolute',
    bottom: 0,
    width: width,
    justifyContent: 'center',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    shadowOpacity: 0,
    elevation: 0,
  },
  iconBtnMinimal: {
    backgroundColor: 'rgba(18,22,34,0.7)', // butonlar da koyu
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnDisabled: {
    opacity: 0.4,
  },
  iconMinimal: {
    color: '#e0e6f7', // ikonlar daha açık
    fontSize: 22,
    fontWeight: '500',
  },
  pageNumMinimal: {
    color: '#e0e6f7', // metinler daha açık
    fontSize: 15,
    marginHorizontal: 8,
    fontWeight: '500',
  },
  pageInputMinimal: {
    backgroundColor: 'rgba(18,22,34,0.7)', // input da koyu
    borderRadius: 6,
    borderWidth: 0,
    paddingHorizontal: 8,
    width: 50,
    textAlign: 'center',
    fontSize: 15,
    color: '#e0e6f7',
    marginHorizontal: 2,
  },
  navBtn: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  navBtnModern: {
    backgroundColor: '#232a3b',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnDisabled: {
    backgroundColor: '#232a3b',
    opacity: 0.5,
  },
  navBtnTextModern: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 28,
  },
  actionBtn: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  actionBtnModern: {
    backgroundColor: '#274690',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 3,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtnTextModern: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 4,
  },
  pageNumBoxModern: {
    backgroundColor: '#232a3b',
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 2,
    elevation: 2,
  },
  pageNumTextModern: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    letterSpacing: 1,
  },
  pageInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#232a3b',
    borderRadius: 10,
    marginLeft: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  pageInputModern: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    width: 70,
    textAlign: 'center',
    fontSize: 16,
    color: '#232a3b',
  },
  goBtnModern: {
    backgroundColor: '#274690',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginLeft: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goBtnTextModern: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
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
  centered: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0b1220',
    zIndex: 20,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  loadingText: {
    color: '#274690',
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
  },
  retryBtn: {
    backgroundColor: '#274690',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginTop: 8,
  },
  retryBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
