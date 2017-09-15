import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LinkyModule } from 'angular-linky';
import { InformationDetailPage } from './information-detail';
import { PipesModule } from '../../shared/pipes.module';

@NgModule({
  declarations: [
    InformationDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(InformationDetailPage),
    PipesModule,
    LinkyModule,
  ],
})
export class InformationDetailPageModule {}
