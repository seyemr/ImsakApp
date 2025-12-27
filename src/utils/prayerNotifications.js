import PushNotification from 'react-native-push-notification';
import { fetchPrayerTimes } from '../api/imsakiye';

// Kanalı oluştur (sadece bir kez çağır)
export function createImsakNotificationChannel() {
  PushNotification.createChannel({
    channelId: 'imsakiye-channel',
    channelName: 'İmsakiye Bildirimleri',
    importance: 4,
    vibrate: true,
  });
}

// Vakitlere 45 dk kala bildirim planla
export async function scheduleVakitNotifications(city) {
  const data = await fetchPrayerTimes(city);
  if (!data || !data.timings) return;
  const now = new Date();

  // Hem obje hem dizi için uyumlu şekilde işle
  const timings = Array.isArray(data.timings)
    ? Object.assign({}, ...data.timings)
    : data.timings;

  Object.entries(timings).forEach(([name, time]) => {
    // time: "06:12" gibi
    if (!/^[0-9]{2}:[0-9]{2}$/.test(time)) return;
    const [hour, minute] = time.split(':').map(Number);
    const vakitDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0);
    const notifDate = new Date(vakitDate.getTime() - 45 * 60 * 1000); // 45 dk önce

    if (notifDate > now) {
      PushNotification.localNotificationSchedule({
        channelId: 'imsakiye-channel',
        title: `${name} vaktine 45 dakika kaldı`,
        message: `${name} vaktine 45 dakika kaldı! Hazırlanmayı unutmayın.`,
        date: notifDate,
        allowWhileIdle: true,
        playSound: true,
        soundName: 'default',
      });
    }
  });
}
