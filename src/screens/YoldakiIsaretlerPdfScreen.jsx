import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Platform, Text } from 'react-native';
import Pdf from 'react-native-pdf';

export default function YoldakiIsaretlerPdfScreen() {
  const { width, height } = Dimensions.get('window');
  const [error, setError] = useState(null);
  let source;
  try {
    source = Platform.OS === 'android'
      ? { uri: 'bundle-assets://Yoldaki_Isaretler.pdf' }
      : require('../../assets/Yoldaki_Isaretler.pdf');
  } catch (e) {
    source = null;
    setError('PDF dosyası bulunamadı veya açılamıyor.');
  }
  return (
    <View style={styles.container}>
      {error || !source ? (
        <Text style={styles.errorText}>{error || 'PDF dosyası bulunamadı.'}</Text>
      ) : (
        <Pdf
          source={source}
          style={{ width, height }}
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
          onError={() => setError('PDF açılamıyor veya bozuk!')}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1220',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    margin: 24,
  },
});
