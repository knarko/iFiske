import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { SQLite } from '@ionic-native/sqlite';
import { Geolocation } from '@ionic-native/geolocation';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AppVersion } from '@ionic-native/app-version';
import { SuperTabsModule } from 'ionic2-super-tabs';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { MyApp } from './app.component';
import { MapDataProvider } from '../providers/map-data/map-data';
import { DatabaseProvider } from '../providers/database/database';
import { ApiProvider } from '../providers/api/api';
import { SettingsProvider } from '../providers/settings/settings';
import { SessionProvider } from '../providers/session/session';
import { UpdateProvider } from '../providers/update/update';
import { AreaProvider } from '../providers/area/area';
import { FishProvider } from '../providers/fish/fish';
import { UserProvider } from '../providers/user/user';
import { PushProvider } from '../providers/push/push';
import { ProductProvider } from '../providers/product/product';
import { OrganizationProvider } from '../providers/organization/organization';
import { InformationProvider } from '../providers/information/information';
import { AdsProvider } from '../providers/ads/ads';
import { TechniqueProvider } from '../providers/technique/technique';
import { CountyProvider } from '../providers/county/county';
import { RuleProvider } from '../providers/rule/rule';
import { TranslateAlertController } from '../providers/translate-alert-controller/translate-alert-controller';
import { TranslateToastController } from '../providers/translate-toast-controller/translate-toast-controller';
import { TranslateLoadingController } from '../providers/translate-loading-controller/translate-loading-controller';
import { TermsProvider } from '../providers/terms/terms';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, {
      preloadMOdules: true,
    }),
    SuperTabsModule.forRoot(),
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
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    MapDataProvider,
    DatabaseProvider,
    ApiProvider,
    SettingsProvider,
    SessionProvider,
    SQLite,
    UpdateProvider,
    AreaProvider,
    Geolocation,
    FishProvider,
    UserProvider,
    PushProvider,
    ProductProvider,
    InAppBrowser,
    OrganizationProvider,
    InformationProvider,
    AdsProvider,
    TechniqueProvider,
    CountyProvider,
    RuleProvider,
    TranslateAlertController,
    TranslateToastController,
    TranslateLoadingController,
    TermsProvider,
    AppVersion,
  ],
})
export class AppModule {}
