import { NgModule } from '@angular/core';
import { MapComponent } from './map/map';
import { AdsComponent } from './ads/ads';
import { IonicModule } from 'ionic-angular';
@NgModule({
	declarations: [
    MapComponent,
    AdsComponent,
  ],
	imports: [
    IonicModule,
  ],
	exports: [
    MapComponent,
    AdsComponent,
  ]
})
export class ComponentsModule {}
