import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EulaPage } from './eula';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    EulaPage,
  ],
  imports: [
    IonicPageModule.forChild(EulaPage),
    TranslateModule,
  ],
})
export class EulaPageModule {}
