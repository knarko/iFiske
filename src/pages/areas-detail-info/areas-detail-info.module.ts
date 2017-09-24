import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AreasDetailInfoPage } from './areas-detail-info';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    AreasDetailInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(AreasDetailInfoPage),
    PipesModule,
  ],
})
export class AreasDetailInfoPageModule {}
