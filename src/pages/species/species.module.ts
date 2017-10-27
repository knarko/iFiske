import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SpeciesPage } from './species';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SpeciesPage,
  ],
  imports: [
    IonicPageModule.forChild(SpeciesPage),
    TranslateModule.forChild(),
  ],
})
export class SpeciesPageModule {}
