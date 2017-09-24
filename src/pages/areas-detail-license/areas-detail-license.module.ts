import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AreasDetailLicensePage } from './areas-detail-license';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    AreasDetailLicensePage,
  ],
  imports: [
    IonicPageModule.forChild(AreasDetailLicensePage),
    PipesModule,
  ],
})
export class AreasDetailLicensePageModule {}
