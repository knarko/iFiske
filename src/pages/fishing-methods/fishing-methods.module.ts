import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FishingMethodsPage } from './fishing-methods';

@NgModule({
  declarations: [
    FishingMethodsPage,
  ],
  imports: [
    IonicPageModule.forChild(FishingMethodsPage),
  ],
})
export class FishingMethodsPageModule {}
