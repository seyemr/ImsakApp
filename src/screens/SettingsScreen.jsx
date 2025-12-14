import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Switch, Button, RadioButton, Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemeContext } from '../context/ThemeContext';
import { useNotificationContext } from '../context/NotificationContext';
import { useLanguage } from '../context/LanguageContext';

const SettingsScreen = () => {
  const { theme, setTheme, themeColors } = useThemeContext();
  const { imsakNotif, setImsakNotif, aksamNotif, setAksamNotif } = useNotificationContext();
  const { lang, setLang, t } = useLanguage();

  const handleThemeChange = (value) => {
    setTheme(value);
  };

  const handleClearCity = async () => {
    await AsyncStorage.removeItem('selected_city');
    Alert.alert(t('cityReset'), t('goHome'));
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }] }>
      <Card style={styles.card}>
        <Card.Title title={t('theme')} />
        <Card.Content>
          <RadioButton.Group onValueChange={handleThemeChange} value={theme}>
            <View style={styles.row}>
              <RadioButton value="light" />
              <Text>{t('light')}</Text>
            </View>
            <View style={styles.row}>
              <RadioButton value="dark" />
              <Text>{t('dark')}</Text>
            </View>
          </RadioButton.Group>
        </Card.Content>
      </Card>
      <Card style={styles.card}>
        <Card.Title title={t('notifications')} />
        <Card.Content>
          <View style={styles.row}>
            <Text>{t('imsakNotif')}</Text>
            <Switch value={imsakNotif} onValueChange={setImsakNotif} />
          </View>
          <View style={styles.row}>
            <Text>{t('aksamNotif')}</Text>
            <Switch value={aksamNotif} onValueChange={setAksamNotif} />
          </View>
        </Card.Content>
      </Card>
      <Card style={styles.card}>
        <Card.Title title={t('settings')} />
        <Card.Content>
          <RadioButton.Group onValueChange={setLang} value={lang}>
            <View style={styles.row}>
              <RadioButton value="tr" />
              <Text>Türkçe</Text>
            </View>
            <View style={styles.row}>
              <RadioButton value="en" />
              <Text>English</Text>
            </View>
          </RadioButton.Group>
        </Card.Content>
      </Card>
      <Button mode="outlined" style={{ marginTop: 24 }} onPress={handleClearCity}>
        {t('resetCity')}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { marginBottom: 16, borderRadius: 10 },
  row: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
});

export default SettingsScreen;
