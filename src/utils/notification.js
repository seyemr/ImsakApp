import PushNotification from 'react-native-push-notification';
import { Platform } from 'react-native';

export const configureNotifications = () => {
  PushNotification.configure({
    onNotification: function (notification) {
      // Bildirim tıklandığında yapılacaklar
    },
    requestPermissions: Platform.OS === 'ios',
  });
};

export const schedulePrayerNotification = ({
  time,
  title,
  message,
  id,
}: {
  time: string; // "HH:mm"
  title: string;
  message: string;
  id: string;
}) => {
  const now = new Date();
  const [hour, minute] = time.split(':').map(Number);
  let notifDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute - 5, 0); // 5 dk önce
  if (notifDate < now) notifDate.setDate(notifDate.getDate() + 1); // Geçmişse ertesi gün

  PushNotification.localNotificationSchedule({
    id,
    channelId: 'imsakiye-channel',
    title,
    message,
    date: notifDate,
    allowWhileIdle: true,
  });
};

export const createNotificationChannel = () => {
  PushNotification.createChannel({
    channelId: 'imsakiye-channel',
    channelName: 'İmsakiye Bildirimleri',
    importance: 4,
    vibrate: true,
  });
};

export const cancelPrayerNotification = (id: string) => {
  PushNotification.cancelLocalNotifications({ id });
};
