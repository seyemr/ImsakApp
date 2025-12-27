import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getQuranProgress, saveQuranProgress } from '../utils/quranProgress';

export default function QuranProgressBar({ page, totalPages }) {
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    getQuranProgress().then(setProgress);
  }, []);

  useEffect(() => {
    saveQuranProgress(page);
    setProgress(page);
  }, [page]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Kaldığın Sayfa: {progress} / {totalPages}</Text>
      <TouchableOpacity style={styles.btn} onPress={() => saveQuranProgress(page)}>
        <Text style={styles.btnText}>Kaydet</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  text: {
    color: '#274690',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 12,
  },
  btn: {
    backgroundColor: '#274690',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
