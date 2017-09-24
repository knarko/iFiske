import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AreasDetailMapPage } from './areas-detail-map';

@NgModule({
  declarations: [
    AreasDetailMapPage,
  ],
  imports: [
    IonicPageModule.forChild(AreasDetailMapPage),
  ],
})
export class AreasDetailMapPageModule {}
