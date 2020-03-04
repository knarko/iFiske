import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

import { AdminHeaderComponent } from './admin-header/admin-header';
import { AdsComponent } from './ads/ads';
import { ChartComponent } from './chart/chart';
import { FaIconComponent } from './fa-icon/fa-icon.component';
import { FishLevelComponent } from './fish-level/fish-level';
import { ImgcacheModule } from '../imgcache/imgcache.module';
import { IonDataFormComponent } from './ion-data-form/ion-data-form';
import { IonErrorsComponent } from './ion-errors/ion-errors';
import { MapComponent } from './map/map';
import { PermitComponent } from './permit/permit';
import { PipesModule } from '../pipes/pipes.module';
import { TabNavbarComponent } from './tab-navbar/tab-navbar';
import { UserInformationComponent } from './user-information/user-information';
import { YoutubeComponent } from './youtube/youtube';
import { HighlightComponent } from './highlight/highlight';
import { PermitLogComponent } from './permit-log/permit-log';
import { QrComponent } from './qr/qr';
import { PermitCodeComponent } from './permit-code/permit-code';
import { CatchesListComponent } from './catches-list/catches-list';

@NgModule({
  declarations: [
    AdminHeaderComponent,
    AdsComponent,
    CatchesListComponent,
    ChartComponent,
    FaIconComponent,
    FishLevelComponent,
    HighlightComponent,
    IonDataFormComponent,
    IonErrorsComponent,
    MapComponent,
    PermitCodeComponent,
    PermitComponent,
    PermitLogComponent,
    QrComponent,
    TabNavbarComponent,
    UserInformationComponent,
    YoutubeComponent,
  ],
  imports: [IonicModule, TranslateModule, PipesModule, ImgcacheModule],
  exports: [
    AdminHeaderComponent,
    AdsComponent,
    CatchesListComponent,
    ChartComponent,
    FaIconComponent,
    FishLevelComponent,
    HighlightComponent,
    IonDataFormComponent,
    IonErrorsComponent,
    MapComponent,
    PermitCodeComponent,
    PermitComponent,
    PermitLogComponent,
    QrComponent,
    TabNavbarComponent,
    UserInformationComponent,
    YoutubeComponent,
  ],
})
export class ComponentsModule {}
