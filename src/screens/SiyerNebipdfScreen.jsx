import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Pdf from 'react-native-pdf';

export default function SiyerNebipdfScreen() {
  const { width, height } = Dimensions.get('window');
  return (
    <View style={styles.container}>
      <Pdf
        source={require('../../assets/siyer-i_nebi.epub')}
        style={{ width: width, height: height }}
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
