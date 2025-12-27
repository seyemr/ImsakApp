import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

export default function RemovedKuranYoluPdfScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.messageText}>
        Kuran Yolu PDF ekranı uygulamadan kaldırıldı.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0b1220',
  },
  messageText: {
    color: 'red',
    fontSize: 20,
    textAlign: 'center',
    margin: 24,
  },
});
