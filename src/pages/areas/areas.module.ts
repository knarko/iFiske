import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AreasPage } from './areas';
import { SuperTabsModule } from 'ionic2-super-tabs';

@NgModule({
  declarations: [
    AreasPage,
  ],
  imports: [
    IonicPageModule.forChild(AreasPage),
    SuperTabsModule,
  ],
})
export class AreasPageModule {}
