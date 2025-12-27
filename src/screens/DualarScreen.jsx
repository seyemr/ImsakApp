import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ScrollView } from 'react-native';
import duas from '../data/duas.json';

const categories = [
  'Tümü',
  ...Array.from(new Set(duas.map((d) => d.category)))
];

export default function DualarScreen() {
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [selectedDua, setSelectedDua] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const filteredDuas = selectedCategory === 'Tümü'
    ? duas
    : duas.filter((d) => d.category === selectedCategory);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Dualar</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryRow}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.categoryBtn, selectedCategory === cat && styles.categoryBtnActive]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <FlatList
        data={filteredDuas}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => { setSelectedDua(item); setModalVisible(true); }}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.text} numberOfLines={2}>{item.turkish}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 32 }}
      />
      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <ScrollView>
              <Text style={styles.modalTitle}>{selectedDua?.title}</Text>
              <Text style={styles.modalArabic}>{selectedDua?.arabic}</Text>
              <Text style={styles.modalTurkish}>{selectedDua?.turkish}</Text>
              <Text style={styles.modalCategory}>{selectedDua?.category}</Text>
            </ScrollView>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeBtnText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8ff',
    padding: 8,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#274690',
    marginBottom: 8,
    textAlign: 'center',
  },
  categoryRow: {
    flexGrow: 0,
    flexDirection: 'row',
    marginBottom: 8,
    paddingVertical: 4,
  },
  categoryBtn: {
    backgroundColor: '#e6eaf3',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginHorizontal: 4,
  },
  categoryBtnActive: {
    backgroundColor: '#274690',
  },
  categoryText: {
    color: '#274690',
    fontWeight: 'bold',
  },
  categoryTextActive: {
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#274690',
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: '#222',
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    width: '100%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#274690',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalArabic: {
    fontSize: 20,
    color: '#222',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'AmiriQuran-Regular',
  },
  modalTurkish: {
    fontSize: 17,
    color: '#232a3b',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalCategory: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
    marginBottom: 10,
  },
  closeBtn: {
    backgroundColor: '#274690',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 8,
    alignSelf: 'center',
    marginTop: 10,
  },
  closeBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
