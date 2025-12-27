import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, FlatList, Modal, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { safeVibrate } from '../utils/safeVibrate';

const defaultZikirs = [
  { key: 'Subhanallah', label: 'Subhanallah' },
  { key: 'Elhamdulillah', label: 'Elhamdulillah' },
  { key: 'Allahu Ekber', label: 'Allahu Ekber' },
  { key: 'La ilahe illallah', label: 'La ilahe illallah' },
  { key: 'Salavat', label: 'Allahumme salli ala Muhammed' },
];

export default function Zikirmatik() {
  const [count, setCount] = useState(0);
  const [selectedZikir, setSelectedZikir] = useState(defaultZikirs[0]);
  const [target, setTarget] = useState(33);
  const [showTargets, setShowTargets] = useState(false);
  const [animValue] = useState(new Animated.Value(1));
  const [customZikirs, setCustomZikirs] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newZikir, setNewZikir] = useState('');
  const [showZikirMenu, setShowZikirMenu] = useState(false);
  const { width } = Dimensions.get('window');

  const handlePress = async () => {
    Animated.sequence([
      Animated.timing(animValue, { toValue: 1.15, duration: 80, useNativeDriver: true }),
      Animated.timing(animValue, { toValue: 1, duration: 80, useNativeDriver: true })
    ]).start();
    setCount(c => c + 1);
    try {
      await safeVibrate(15);
    } catch (e) {}
  };

  const handleReset = () => {
    setCount(0);
  };

  const handleTarget = (val) => {
    setTarget(val);
    setShowTargets(false);
  };

  const handleAddZikir = () => {
    if (newZikir.trim().length > 0) {
      const newItem = { key: newZikir.trim() + Date.now(), label: newZikir.trim() };
      setCustomZikirs([...customZikirs, newItem]);
      setSelectedZikir(newItem);
      setCount(0);
      setNewZikir('');
      setShowAddModal(false);
    }
  };

  const handleDeleteZikir = (key) => {
    setCustomZikirs(customZikirs.filter(z => z.key !== key));
    if (selectedZikir.key === key) {
      setSelectedZikir(defaultZikirs[0]);
      setCount(0);
    }
  };

  return (
    <TouchableOpacity style={styles.fullScreen} activeOpacity={1} onPress={handlePress}>
      <View style={styles.container} pointerEvents="box-none">
        <Animated.View style={[styles.circle, { transform: [{ scale: animValue }] }]}> 
          <Icon name="counter" size={48} color="#274690" style={{ marginBottom: 8 }} />
          <Text style={styles.count}>{count}</Text>
          <Text style={styles.zikirLabel}>{selectedZikir.label}</Text>
          <Text style={styles.target}>{target ? `Hedef: ${target}` : ''}</Text>
        </Animated.View>
        <TouchableOpacity style={styles.hamburgerBtn} onPress={() => setShowZikirMenu(true)}>
          <Icon name="menu" size={32} color="#274690" />
        </TouchableOpacity>
        <Modal visible={showZikirMenu} transparent animationType="slide" onRequestClose={() => setShowZikirMenu(false)}>
          <View style={styles.menuBg}>
            <View style={styles.menuBox}>
              <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
                <Text style={styles.menuTitle}>Zikirlerim</Text>
                <TouchableOpacity onPress={() => setShowZikirMenu(false)} style={styles.menuCloseBtn}>
                  <Icon name="close" size={28} color="#274690" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={[...defaultZikirs, ...customZikirs]}
                keyExtractor={item => item.key}
                renderItem={({ item }) => (
                  <View style={[styles.zikirListItem, selectedZikir.key === item.key && styles.zikirListItemActive]}>
                    <TouchableOpacity style={{flex:1}} onPress={() => { setSelectedZikir(item); setCount(0); setShowZikirMenu(false); }}>
                      <Text style={[styles.zikirListText, selectedZikir.key === item.key && styles.zikirListTextActive]}>{item.label}</Text>
                    </TouchableOpacity>
                    {customZikirs.find(z => z.key === item.key) && (
                      <TouchableOpacity onPress={() => handleDeleteZikir(item.key)} style={styles.deleteZikirBtn}>
                        <Icon name="delete" size={22} color="#c00" />
                      </TouchableOpacity>
                    )}
                  </View>
                )}
                ListFooterComponent={
                  <TouchableOpacity style={styles.addZikirBtn} onPress={() => setShowAddModal(true)}>
                    <Icon name="plus-circle" size={28} color="#274690" />
                  </TouchableOpacity>
                }
                style={{ maxHeight: 260, width: '100%' }}
              />
            </View>
          </View>
        </Modal>
        <Modal visible={showAddModal} transparent animationType="fade" onRequestClose={() => setShowAddModal(false)}>
          <View style={styles.addModalBg}>
            <View style={styles.addModalBox}>
              <Text style={styles.addModalTitle}>Yeni Zikir Ekle</Text>
              <TextInput
                style={styles.addModalInput}
                value={newZikir}
                onChangeText={setNewZikir}
                placeholder="Zikir adı"
                placeholderTextColor="#888"
                maxLength={40}
                autoFocus
              />
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
                <TouchableOpacity onPress={() => setShowAddModal(false)} style={styles.addModalBtn}>
                  <Text style={{ color: '#274690', fontWeight: 'bold' }}>İptal</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleAddZikir} style={styles.addModalBtn}>
                  <Text style={{ color: '#274690', fontWeight: 'bold' }}>Ekle</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <View style={styles.bottomRow}>
          <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
            <Icon name="refresh" size={24} color="#fff" />
            <Text style={styles.resetBtnText}>Sıfırla</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.targetBtn} onPress={() => setShowTargets(!showTargets)}>
            <Icon name="bullseye-arrow" size={24} color="#fff" />
            <Text style={styles.targetBtnText}>Hedef</Text>
          </TouchableOpacity>
        </View>
        {showTargets && (
          <View style={styles.targetModal}>
            {[33, 99, 100, 500, 1000].map(val => (
              <TouchableOpacity key={val} style={styles.targetOption} onPress={() => handleTarget(val)}>
                <Text style={styles.targetOptionText}>{val}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: '#e6eaf3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  circle: {
    backgroundColor: '#fff',
    borderRadius: 180,
    width: 260,
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 24,
    alignSelf: 'center',
  },
  count: {
    fontSize: 54,
    color: '#274690',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  zikirLabel: {
    fontSize: 18,
    color: '#232a3b',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  target: {
    fontSize: 15,
    color: '#888',
    marginTop: 2,
  },
  zikirListContainer: {
    width: '90%',
    alignSelf: 'center',
    marginBottom: 18,
    marginTop: 8,
    backgroundColor: '#f2f4fa',
    borderRadius: 16,
    padding: 8,
  },
  zikirListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e6f7',
    borderRadius: 8,
    marginBottom: 2,
    backgroundColor: '#fff',
  },
  zikirListItemActive: {
    backgroundColor: '#dbeafe',
  },
  zikirListText: {
    fontSize: 17,
    color: '#274690',
    fontWeight: 'bold',
  },
  zikirListTextActive: {
    color: '#1e293b',
  },
  deleteZikirBtn: {
    marginLeft: 10,
    padding: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  resetBtn: {
    backgroundColor: '#274690',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  resetBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 6,
  },
  targetBtn: {
    backgroundColor: '#888',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  targetBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 6,
  },
  targetModal: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  targetOption: {
    backgroundColor: '#e6eaf3',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginHorizontal: 8,
  },
  targetOptionText: {
    color: '#274690',
    fontWeight: 'bold',
    fontSize: 18,
  },
  addZikirBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  addModalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addModalBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: 300,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  addModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#274690',
    marginBottom: 12,
    textAlign: 'center',
  },
  addModalInput: {
    backgroundColor: '#f2f4fa',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: '#232a3b',
  },
  addModalBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  hamburgerBtn: {
    position: 'absolute',
    top: 24,
    right: 24,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 6,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  menuBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menuBox: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
    padding: 18,
    width: 300,
    marginTop: 0,
    minHeight: 180,
    maxHeight: 400,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  menuTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#274690',
    marginBottom: 2,
  },
  menuCloseBtn: {
    padding: 4,
    marginLeft: 8,
  },
});
