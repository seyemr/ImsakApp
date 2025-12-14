import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import Header from '../components/Header';
import ChatMessage from '../components/ChatMessage';
import InputBar from '../components/InputBar';

const initialMessages = [
  { type: 'incoming', text: 'Merhaba! Size nasıl yardımcı olabilirim?' },
  { type: 'outgoing', text: 'Bugün hava nasıl?' },
  { type: 'incoming', text: 'İstanbul’da hava açık ve 18°C.' },
  { type: 'outgoing', text: 'Teşekkürler!' },
  { type: 'incoming', text: 'Rica ederim. Başka bir sorunuz var mı?' },
];

const ChatScreen = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { type: 'outgoing', text: input }]);
      setInput('');
    }
  };

  return (
    <View style={styles.frame}>
      <Header />
      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingVertical: 16 }}>
        {messages.map((msg, i) => (
          <ChatMessage key={i} type={msg.type} text={msg.text} />
        ))}
      </ScrollView>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <InputBar value={input} onChangeText={setInput} onSend={handleSend} />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  frame: {
    flex: 1,
    backgroundColor: '#F5F5F7',
    borderRadius: 24,
    overflow: 'hidden',
    width: '100%',
    maxWidth: 390,
    alignSelf: 'center',
    minHeight: 844,
    paddingTop: 24,
    paddingBottom: 24,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
  },
});

export default ChatScreen;
