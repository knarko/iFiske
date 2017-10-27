import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InformationPage } from './information';
import { PipesModule } from '../../pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    InformationPage,
  ],
  imports: [
    IonicPageModule.forChild(InformationPage),
    TranslateModule.forChild(),
    PipesModule,
  ],
})
export class InformationPageModule { }
