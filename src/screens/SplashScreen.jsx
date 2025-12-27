import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('MainTabs');
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <WebView
        source={{ html: `
          <html>
            <body style="margin:0; background:#0b1220; display:flex; align-items:center; justify-content:center; height:100vh;">
              <img src="file:///android_asset/besmele.gif" style="width:100vw; height:100vh; object-fit:cover;" />
            </body>
          </html>
        ` }}
        originWhitelist={['*']}
        style={styles.fullscreenWebview}
        javaScriptEnabled
        domStorageEnabled
        allowFileAccess
        allowUniversalAccessFromFileURLs
        allowFileAccessFromFileURLs
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1220',
  },
  fullscreenWebview: {
    flex: 1,
    backgroundColor: '#0b1220',
  },
});

export default SplashScreen;
