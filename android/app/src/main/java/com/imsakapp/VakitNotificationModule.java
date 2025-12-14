package com.imsakapp;

import android.content.Intent;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import javax.annotation.Nonnull;

public class VakitNotificationModule extends ReactContextBaseJavaModule {
    public VakitNotificationModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Nonnull
    @Override
    public String getName() {
        return "VakitNotification";
    }

    @ReactMethod
    public void showVakitNotification(String city, String vakit, Promise promise) {
        try {
            Intent intent = new Intent(getReactApplicationContext(), VakitNotificationService.class);
            intent.putExtra(VakitNotificationService.EXTRA_CITY, city);
            intent.putExtra(VakitNotificationService.EXTRA_VAKIT, vakit);
            getReactApplicationContext().startForegroundService(intent);
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("ERR_VAKIT_NOTIFICATION", e);
        }
    }
}
