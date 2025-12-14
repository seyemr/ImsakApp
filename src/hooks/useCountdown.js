import { useEffect, useState } from 'react';

function parseTimeToDate(time: string): Date {
  // time: "HH:mm" formatında
  const now = new Date();
  const [hour, minute] = time.split(':').map(Number);
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0);
}

export const useCountdown = (nextPrayerTime: string) => {
  const [remaining, setRemaining] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = parseTimeToDate(nextPrayerTime);
    const update = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) {
        setRemaining({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setRemaining({ hours, minutes, seconds });
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [nextPrayerTime]);

  return remaining;
};
