export interface PrayerTimes {
  date: {
    readable: string;
    timestamp: string;
    gregorian: { date: string; };
    hijri: { date: string; };
  };
  timings: {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Sunset: string;
    Maghrib: string;
    Isha: string;
    Imsak: string;
    Midnight: string;
  };
  meta: {
    latitude: number;
    longitude: number;
    timezone: string;
    method: { id: number; name: string; };
  };
}

export interface PrayerTimesResponse {
  code: number;
  status: string;
  data: PrayerTimes;
}
