import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Button, Alert } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { useThemeContext } from '../context/ThemeContext';
import { useNotificationContext } from '../context/NotificationContext';

const initialAlarms = [
  { id: 1, time: '05:30', day: 'Pazartesi' },
  { id: 2, time: '12:45', day: 'Cuma' },
];

const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

const AlarmSettingsScreen = ({ navigation }) => {
  const { themeColors } = useThemeContext();
  const { imsakNotif, setImsakNotif, aksamNotif, setAksamNotif } = useNotificationContext();
  const [alarms, setAlarms] = useState(initialAlarms);
  const [time, setTime] = useState('');
  const [day, setDay] = useState(days[0]);
  const { t } = useLanguage();

  function addAlarm() {
    if (!time) return Alert.alert(t('alarmSettings'), t('messagePlaceholder'));
    setAlarms([...alarms, { id: Date.now(), time, day }]);
    setTime('');
    setDay(days[0]);
  }

  function removeAlarm(id) {
    setAlarms(alarms.filter(a => a.id !== id));
  }

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }] }>
      <Text style={[styles.title, { color: themeColors.text }]}>{t('alarmSettings')}</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={{ color: '#222', fontSize: 16, paddingHorizontal: 10, paddingVertical: 6, flex: 1 }}
          value={time}
          onChangeText={setTime}
          placeholder={t('imsak') + ' (örn: 06:00)'}
          placeholderTextColor="#888"
          keyboardType="numeric"
          autoCorrect={false}
          autoCapitalize="none"
          underlineColorAndroid="transparent"
          importantForAutofill="no"
        />
        <View style={styles.dayPicker}>
          <Text style={{ color: '#e6eaf3', marginBottom: 4 }}>{t('day')}:</Text>
          <FlatList
            data={days}
            horizontal
            keyExtractor={d => d}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => setDay(item)} style={[styles.dayBtn, day === item && styles.dayBtnActive]}>
                <Text style={{ color: day === item ? '#111a2f' : '#e6eaf3' }}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
        <Button title={t('add')} color="#FFEB3B" onPress={addAlarm} />
      </View>
      <FlatList
        data={alarms}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.alarmRow}>
            <Text style={[styles.alarmText, { color: themeColors.text }]}>{item.day} - {item.time}</Text>
            <TouchableOpacity onPress={() => removeAlarm(item.id)} style={styles.deleteBtn}>
              <Text style={{ color: '#fff' }}>{t('delete')}</Text>
            </TouchableOpacity>
          </View>
        )}
        style={{ marginTop: 16, width: '100%' }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  inputRow: { width: '100%', marginBottom: 12 },
  dayPicker: { marginBottom: 8 },
  dayBtn: { backgroundColor: '#274690', borderRadius: 8, padding: 8, marginRight: 4 },
  dayBtnActive: { backgroundColor: '#FFEB3B' },
  alarmRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#274690', borderRadius: 8, padding: 12, marginBottom: 8 },
  alarmText: { fontSize: 16 },
  deleteBtn: { backgroundColor: '#a94442', borderRadius: 8, padding: 8 },
});

export default AlarmSettingsScreen;
