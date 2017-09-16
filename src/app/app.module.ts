import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { SQLite } from '@ionic-native/sqlite';
import { Geolocation } from '@ionic-native/geolocation';
import { InAppBrowser } from '@ionic-native/in-app-browser';

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

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
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
  ]
})
export class AppModule {}
