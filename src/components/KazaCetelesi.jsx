import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function KazaCetelesi() {
  const [borc, setBorc] = useState(0);
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Kaza Namazı Borcu:</Text>
      <Text style={styles.count}>{borc}</Text>
      <TouchableOpacity style={styles.btn} onPress={() => setBorc(borc + 1)}>
        <Text style={styles.btnText}>+1 Ekle</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={() => borc > 0 && setBorc(borc - 1)}>
        <Text style={styles.btnText}>-1 Azalt</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.resetBtn} onPress={() => setBorc(0)}>
        <Text style={styles.btnText}>Sıfırla</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 16,
  },
  label: {
    fontSize: 18,
    color: '#274690',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  count: {
    fontSize: 36,
    color: '#274690',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  btn: {
    backgroundColor: '#274690',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginBottom: 8,
  },
  resetBtn: {
    backgroundColor: '#aaa',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
