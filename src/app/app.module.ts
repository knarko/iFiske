import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandler, NgModule, LOCALE_ID } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { SuperTabsModule } from '@ifiske/ionic2-super-tabs';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// Ionic Native
import { AppVersion } from '@ionic-native/app-version';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { FCM } from '@ionic-native/fcm';
import { File } from '@ionic-native/file';
import { Geolocation } from '@ionic-native/geolocation';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { Network } from '@ionic-native/network';
import { Pro } from '@ionic-native/pro';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { SMS } from '@ionic-native/sms';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SQLite } from '@ionic-native/sqlite';
import { StatusBar } from '@ionic-native/status-bar';


// Components
import { MyApp } from './app.component';

import { IonicProErrorHandler } from './pro';

// Providers
import { AdsProvider } from '../providers/ads/ads';
import { ApiProvider } from '../providers/api/api';
import { AreaProvider } from '../providers/area/area';
import { CountyProvider } from '../providers/county/county';
import { DatabaseProvider } from '../providers/database/database';
import { FishProvider } from '../providers/fish/fish';
import { InformationProvider } from '../providers/information/information';
import { MapDataProvider } from '../providers/map-data/map-data';
import { OrganizationProvider } from '../providers/organization/organization';
import { ProductProvider } from '../providers/product/product';
import { PushProvider } from '../providers/push/push';
import { RuleProvider } from '../providers/rule/rule';
import { SessionProvider } from '../providers/session/session';
import { SettingsProvider } from '../providers/settings/settings';
import { TechniqueProvider } from '../providers/technique/technique';
import { TermsProvider } from '../providers/terms/terms';
import { TranslateActionSheetController } from '../providers/translate-action-sheet-controller/translate-action-sheet-controller';
import { TranslateAlertController } from '../providers/translate-alert-controller/translate-alert-controller';
import { TranslateLoadingController } from '../providers/translate-loading-controller/translate-loading-controller';
import { TranslateToastController } from '../providers/translate-toast-controller/translate-toast-controller';
import { UpdateProvider } from '../providers/update/update';
import { UserProvider } from '../providers/user/user';
import { PlatformProvider } from '../providers/platform/platform';
import { DeployProvider } from '../providers/deploy/deploy';
import { CreateAccountProvider } from '../providers/create-account/create-account';
import { AdminProvider } from '../providers/admin/admin';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

// Import locale
import localeSv from '@angular/common/locales/sv';
import { registerLocaleData } from '@angular/common';

import { ImgcacheModule } from '../imgcache/imgcache.module';

registerLocaleData(localeSv);

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,

    IonicModule.forRoot(MyApp, {
      preloadModules: true,
      ios: {
        statusbarPadding: true,
      },
    }),

    SuperTabsModule.forRoot(),

    ImgcacheModule.forRoot({
      fallback: true,
    }),

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      useDefaultLang: false,
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    IonicErrorHandler,
    [{ provide: ErrorHandler, useClass: IonicProErrorHandler }],

    // TODO: dynamic locale
    { provide: LOCALE_ID, useValue: 'sv' },

    // Ionic native
    AppVersion,
    BarcodeScanner,
    FCM,
    File,
    Geolocation,
    LaunchNavigator,
    Network,
    Pro,
    ScreenOrientation,
    SMS,
    SplashScreen,
    SQLite,
    StatusBar,

    //Providers
    AdminProvider,
    AdsProvider,
    ApiProvider,
    AreaProvider,
    CountyProvider,
    CreateAccountProvider,
    DatabaseProvider,
    DeployProvider,
    FishProvider,
    InformationProvider,
    MapDataProvider,
    OrganizationProvider,
    PlatformProvider,
    ProductProvider,
    PushProvider,
    RuleProvider,
    SessionProvider,
    SettingsProvider,
    TechniqueProvider,
    TermsProvider,
    TranslateActionSheetController,
    TranslateAlertController,
    TranslateLoadingController,
    TranslateToastController,
    UpdateProvider,
    UserProvider,
  ],
})
export class AppModule {}
