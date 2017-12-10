import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FossPage } from './foss';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    FossPage,
  ],
  imports: [
    IonicPageModule.forChild(FossPage),
    TranslateModule,
  ],
})
export class FossPageModule {}
