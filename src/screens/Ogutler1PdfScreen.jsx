import React from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import Pdf from 'react-native-pdf';

export default function Ogutler1PdfScreen() {
  const { width, height } = Dimensions.get('window');
  const source = Platform.OS === 'android'
    ? { uri: 'bundle-assets://ogutler_1.pdf' }
    : require('../../assets/ogutler_1.pdf');
  return (
    <View style={styles.container}>
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1220',
  },
});
