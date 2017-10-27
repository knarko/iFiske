import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AreasDetailLicensePage } from './areas-detail-license';
import { PipesModule } from '../../pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AreasDetailLicensePage,
  ],
  imports: [
    IonicPageModule.forChild(AreasDetailLicensePage),
    TranslateModule.forChild(),
    PipesModule,
  ],
})
export class AreasDetailLicensePageModule {}
