import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const InputBar = ({ value, onChangeText, onSend }) => (
  <View style={styles.inputBar}>
    <TextInput
      style={{ color: '#1A1A1A', fontSize: 16, paddingVertical: 8, paddingHorizontal: 0, flex: 1 }}
      placeholder="Mesaj yaz…"
      placeholderTextColor="#888"
      value={value}
      onChangeText={onChangeText}
    />
    <TouchableOpacity style={styles.sendBtn} onPress={onSend}>
      <Icon name="send" size={22} color="#fff" />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    margin: 8,
    shadowColor: '#4A6CF7',
    shadowOpacity: 0.06,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4A6CF7',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});

export default InputBar;
