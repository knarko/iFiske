import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AreasDetailMapPage } from './areas-detail-map';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [AreasDetailMapPage],
  imports: [
    IonicPageModule.forChild(AreasDetailMapPage),
    TranslateModule.forChild(),
    ComponentsModule,
  ],
})
export class AreasDetailMapPageModule {}
