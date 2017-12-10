import { NgModule } from '@angular/core';
import { MapComponent } from './map/map';
import { AdsComponent } from './ads/ads';
import { IonicModule } from 'ionic-angular';
import { YoutubeComponent } from './youtube/youtube';
import { FishLevelComponent } from './fish-level/fish-level';
import { FaIconComponent } from './fa-icon/fa-icon.component';
import { LoginComponent } from './login/login.component';
import { TranslateModule } from '@ngx-translate/core';
import { IonErrorsComponent } from './ion-errors/ion-errors';
import { IonDataFormComponent } from './ion-data-form/ion-data-form';
import { PipesModule } from '../pipes/pipes.module';
@NgModule({
	declarations: [
    MapComponent,
    AdsComponent,
    YoutubeComponent,
    FishLevelComponent,
    FaIconComponent,
    LoginComponent,
    IonErrorsComponent,
    IonDataFormComponent,
  ],
	imports: [
    IonicModule,
    TranslateModule,
    PipesModule,
  ],
	exports: [
    MapComponent,
    AdsComponent,
    YoutubeComponent,
    FishLevelComponent,
    FaIconComponent,
    LoginComponent,
    IonErrorsComponent,
    IonDataFormComponent,
  ],
})
export class ComponentsModule {}
