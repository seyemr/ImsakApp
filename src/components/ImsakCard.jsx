import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ImsakCard = ({ data }: { data: any }) => (
  <View style={styles.card}>
    <Text>{data.date}</Text>
    <Text>İmsak: {data.imsak}</Text>
    <Text>Güneş: {data.gunes}</Text>
    <Text>Öğle: {data.ogle}</Text>
    <Text>İkindi: {data.ikindi}</Text>
    <Text>Akşam: {data.aksam}</Text>
    <Text>Yatsı: {data.yatsi}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    padding: 16,
    margin: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 2,
  },
});

export default ImsakCard;
