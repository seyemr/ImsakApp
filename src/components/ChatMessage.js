import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ChatMessage = ({ type = 'incoming', text }) => (
  <View style={[styles.bubble, type === 'outgoing' ? styles.outgoing : styles.incoming]}>
    <Text style={[styles.text, type === 'outgoing' ? styles.textOutgoing : styles.textIncoming]}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  bubble: {
    maxWidth: '80%',
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  incoming: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
  },
  outgoing: {
    backgroundColor: '#4A6CF7',
    alignSelf: 'flex-end',
  },
  text: {
    fontSize: 16,
  },
  textIncoming: {
    color: '#1A1A1A',
  },
  textOutgoing: {
    color: '#FFFFFF',
  },
});

export default ChatMessage;
