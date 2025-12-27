import { Platform, PermissionsAndroid, Vibration } from 'react-native';

export async function safeVibrate(pattern = 15) {
  if (Platform.OS !== 'android') return;
  try {
    // Android 12+ için izin kontrolü
    if (Platform.Version >= 31) {
      const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.VIBRATE);
      if (!granted) return;
    }
    Vibration.vibrate(pattern);
  } catch (e) {
    // Hata loglanabilir, crash engellenmez
    console.log('Vibration error:', e);
  }
}
