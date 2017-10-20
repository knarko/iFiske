import { NgModule } from '@angular/core';
import { MapComponent } from './map/map';
import { AdsComponent } from './ads/ads';
import { IonicModule } from 'ionic-angular';
import { YoutubeComponent } from './youtube/youtube';
import { FishLevelComponent } from './fish-level/fish-level';
@NgModule({
	declarations: [
    MapComponent,
    AdsComponent,
    YoutubeComponent,
    FishLevelComponent,
  ],
	imports: [
    IonicModule,
  ],
	exports: [
    MapComponent,
    AdsComponent,
    YoutubeComponent,
    FishLevelComponent,
  ],
})
export class ComponentsModule {}
