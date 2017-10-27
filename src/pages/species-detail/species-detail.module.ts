import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SpeciesDetailPage } from './species-detail';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SpeciesDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(SpeciesDetailPage),
    TranslateModule.forChild(),
  ],
})
export class SpeciesDetailPageModule {}
