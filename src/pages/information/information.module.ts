import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InformationPage } from './information';
import { PipesModule } from '../../shared/pipes.module';

@NgModule({
  declarations: [
    InformationPage,
  ],
  imports: [
    IonicPageModule.forChild(InformationPage),
    PipesModule,
  ],
})
export class InformationPageModule { }
