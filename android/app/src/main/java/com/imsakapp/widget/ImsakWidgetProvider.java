package com.imsakapp.widget;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.widget.RemoteViews;
import com.imsakapp.R;

public class ImsakWidgetProvider extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_imsak);
            // Widget'a tıklama ile uygulamayı aç
            Intent intent = context.getPackageManager().getLaunchIntentForPackage(context.getPackageName());
            PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            views.setOnClickPendingIntent(R.id.widget_city, pendingIntent);
            // Modern örnek veri
            views.setTextViewText(R.id.widget_city, "İSTANBUL, TÜRKİYE");
            views.setTextViewText(R.id.widget_date, "7 Nisan, Çarşamba");
            views.setTextViewText(R.id.widget_imsak, "İmsak\n05:02");
            views.setTextViewText(R.id.widget_gunes, "Güneş\n06:31");
            views.setTextViewText(R.id.widget_ogle, "Öğle\n13:11");
            views.setTextViewText(R.id.widget_ikindi, "İkindi\n16:49");
            views.setTextViewText(R.id.widget_aksam, "Akşam\n19:42");
            views.setTextViewText(R.id.widget_yatsi, "Yatsı\n21:05");
            views.setTextViewText(R.id.widget_kalan_sure, "İftara 1s 47dk");
            appWidgetManager.updateAppWidget(appWidgetId, views);
        }
    }
}
