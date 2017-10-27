import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AreasPage } from './areas';
import { SuperTabsModule } from 'ionic2-super-tabs';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AreasPage,
  ],
  imports: [
    IonicPageModule.forChild(AreasPage),
    TranslateModule.forChild(),
    SuperTabsModule,
  ],
})
export class AreasPageModule {}
