import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AreasDetailPage } from './areas-detail';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [AreasDetailPage],
  imports: [
    IonicPageModule.forChild(AreasDetailPage),
    TranslateModule.forChild(),
  ],
})
export class AreasDetailPageModule {}
