package com.imsakapp;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.IBinder;
import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

public class VakitNotificationService extends Service {
    public static final String CHANNEL_ID = "imsak_vakit_channel";
    public static final int NOTIF_ID = 1001;
    public static final String EXTRA_CITY = "city";
    public static final String EXTRA_VAKIT = "vakit";

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        String city = intent != null && intent.hasExtra(EXTRA_CITY) ? intent.getStringExtra(EXTRA_CITY) : "Şehir";
        String vakit = intent != null && intent.hasExtra(EXTRA_VAKIT) ? intent.getStringExtra(EXTRA_VAKIT) : "İmsak: 06:00";
        createNotificationChannel();
        Intent openAppIntent = getPackageManager().getLaunchIntentForPackage(getPackageName());
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, openAppIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle(city)
                .setContentText(vakit)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentIntent(pendingIntent)
                .setOngoing(true)
                .build();
        startForeground(NOTIF_ID, notification);
        return START_STICKY;
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    "Vakit Bildirimi",
                    NotificationManager.IMPORTANCE_LOW
            );
            channel.setDescription("Güncel vakitler üst çubuk bildirimi");
            NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            manager.createNotificationChannel(channel);
        }
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
