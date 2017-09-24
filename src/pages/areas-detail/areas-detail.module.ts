import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AreasDetailPage } from './areas-detail';
import { SuperTabsModule } from 'ionic2-super-tabs';

@NgModule({
  declarations: [
    AreasDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(AreasDetailPage),
    SuperTabsModule,
  ],
})
export class AreasDetailPageModule {}
