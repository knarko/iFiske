import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FishingMethodsPage } from './fishing-methods';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    FishingMethodsPage,
  ],
  imports: [
    IonicPageModule.forChild(FishingMethodsPage),
    TranslateModule.forChild(),
  ],
})
export class FishingMethodsPageModule {}
