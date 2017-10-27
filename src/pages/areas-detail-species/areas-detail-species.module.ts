import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AreasDetailSpeciesPage } from './areas-detail-species';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AreasDetailSpeciesPage,
  ],
  imports: [
    IonicPageModule.forChild(AreasDetailSpeciesPage),
    TranslateModule.forChild(),
  ],
})
export class AreasDetailSpeciesPageModule {}
