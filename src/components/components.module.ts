import { NgModule } from '@angular/core';
import { MapComponent } from './map/map';
import { AdsComponent } from './ads/ads';
import { IonicModule } from 'ionic-angular';
import { YoutubeComponent } from './youtube/youtube';
@NgModule({
	declarations: [
    MapComponent,
    AdsComponent,
    YoutubeComponent,
  ],
	imports: [
    IonicModule,
  ],
	exports: [
    MapComponent,
    AdsComponent,
    YoutubeComponent,
  ]
})
export class ComponentsModule {}
