import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Assets klasöründeki PDF dosyalarını buraya manuel olarak ekleyin veya otomatik tarama için native modül gerekir.
// Şimdilik örnek olarak birkaç PDF dosyası ekliyoruz:
const pdfList = [
  { name: 'Kuran Kerim Meali', file: 'meal.pdf', type: 'pdf' },
  { name: 'Riyazüs Salihin', file: 'Riyazus_Salihin.pdf', type: 'pdf' },
  { name: 'Gelin Müslüman Olalım', file: 'mevdudi.pdf', type: 'pdf' },
  { name: 'Doğu ile Batı Arasında İslam', file: 'aliyya.pdf', type: 'pdf' },
  { name: 'Öğütler 1', file: 'ogutler_1.pdf', type: 'pdf' },
  { name: 'Öğütler 2', file: 'ogutler_2.pdf', type: 'pdf' },
  { name: 'Müslümanca Düşünme Üzerine', file: 'rasim.pdf', type: 'pdf' },
  { name: 'Siyer-i Nebi', file: 'siyer.pdf', type: 'pdf' },
  { name: '40 Ayette Kuran', file: '40AyetteKuran.pdf', type: 'pdf' },
  { name: 'Kuran Oku Anla Yaşa', file: 'KuranOkuAnlaYasa.pdf', type: 'pdf' },
  { name: 'Yoldaki Işaretler', file: 'Yoldaki_Isaretler.pdf', type: 'pdf' },
  { name: 'Kur’an-ı Kerim', file: 'kuran.pdf', type: 'pdf' },
  
  
];

const numColumns = 2;
const screenWidth = Dimensions.get('window').width;
const itemWidth = screenWidth / numColumns - 24;

const pdfScreenMap = {
  'meal.pdf': 'MealPdfScreen',
  'Riyazus_Salihin.pdf': 'RiyazusSalihinPdfScreen',
  'mevdudi.pdf': 'MevdudiPdfScreen',
  'aliyya.pdf': 'AliyyaPdfScreen',
  'ogutler_1.pdf': 'Ogutler1PdfScreen',
  'ogutler_2.pdf': 'Ogutler2PdfScreen',
  'rasim.pdf': 'RasimPdfScreen',
  'siyer.pdf': 'SiyerPdfScreen',
  '40AyetteKuran.pdf': 'KirkAyetPdfScreen',
  'KuranOkuAnlaYasa.pdf': 'KuranOkuAnlaYasaPdfScreen', // Türkçe karakter ve büyük/küçük harf uyumlu
  'Yoldaki_Isaretler.pdf': 'YoldakiIsaretlerPdfScreen',
  'kuran.pdf': 'KuranPdfScreen',
  'Kur’an-ı Kerim.pdf': 'KuranKerimMealiPdfScreen', // Eğer bu dosya farklıysa ayrı ekran, aynıysa yukarıdakiyle eşleştirilebilir
  // ...diğerleri...
};

export default function PdfLibraryScreen({ navigation }) {
  const [isGrid, setIsGrid] = useState(true);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={isGrid ? styles.gridItem : styles.listItem}
      onPress={() => {
        if (item.type === 'pdf' && pdfScreenMap[item.file]) {
          navigation.navigate(pdfScreenMap[item.file]);
        } else if (item.type === 'epub') {
          navigation.navigate('EpubViewerScreen', { epubFile: item.file, title: item.name });
        } else if (item.type === 'doc') {
          navigation.navigate('DocViewerScreen', { docFile: item.file, title: item.name });
        }
      }}
    >
      <Icon
        name={item.type === 'pdf' ? 'document-text-outline' : item.type === 'epub' ? 'book-outline' : 'document-attach-outline'}
        size={36}
        color="#4A90E2"
        style={{ marginBottom: 8 }}
      />
      <Text style={styles.pdfName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>PDF Kütüphanesi</Text>
        <View style={styles.switchRow}>
          <Icon name="list" size={22} color={isGrid ? '#aaa' : '#4A90E2'} />
          <Switch
            value={isGrid}
            onValueChange={setIsGrid}
            thumbColor={isGrid ? '#4A90E2' : '#aaa'}
            trackColor={{ false: '#ccc', true: '#b3d4fc' }}
          />
          <Icon name="grid" size={22} color={isGrid ? '#4A90E2' : '#aaa'} />
        </View>
      </View>
      <FlatList
        data={pdfList}
        key={isGrid ? 'g' : 'l'}
        keyExtractor={item => item.file}
        renderItem={renderItem}
        numColumns={isGrid ? numColumns : 1}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#4A90E2' },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  listContent: { padding: 12 },
  gridItem: {
    flex: 1,
    margin: 8,
    backgroundColor: '#f5f7fa',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    minWidth: itemWidth,
    maxWidth: itemWidth,
    elevation: 2,
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
    borderRadius: 12,
    marginVertical: 6,
    marginHorizontal: 8,
    padding: 18,
    elevation: 2,
  },
  pdfName: { fontSize: 16, color: '#333', fontWeight: '500' },
});
