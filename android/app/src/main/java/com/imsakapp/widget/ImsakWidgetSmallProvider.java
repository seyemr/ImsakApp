package com.imsakapp.widget;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.widget.RemoteViews;
import com.imsakapp.R;

public class ImsakWidgetSmallProvider extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_imsak_small);
            Intent intent = context.getPackageManager().getLaunchIntentForPackage(context.getPackageName());
            PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            views.setOnClickPendingIntent(R.id.widget_kucuk_vakit, pendingIntent);
            // Modern örnek veri
            views.setTextViewText(R.id.widget_kucuk_vakit, "İkindi");
            views.setTextViewText(R.id.widget_kucuk_sure, "1s 47dk");
            appWidgetManager.updateAppWidget(appWidgetId, views);
        }
    }
}
