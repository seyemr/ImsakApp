import React, { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('MainTabs');
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigation]);

  // Android için asset yolu, iOS için bundle yolu
  const gifSource = Platform.OS === 'android'
    ? 'file:///android_asset/besmele.gif'
    : 'besmele.gif'; // iOS için HTML'de bundle root

  // WebView ile HTML içinde GIF gösterimi
  const html = `<html><body style="margin:0;padding:0;background:#0b1220;"><img src="${gifSource}" style="width:100vw;height:100vh;object-fit:cover;" /></body></html>`;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scalesPageToFit={true}
        automaticallyAdjustContentInsets={false}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1220',
  },
  webview: {
    flex: 1,
    backgroundColor: '#0b1220',
  },
});

export default SplashScreen;
