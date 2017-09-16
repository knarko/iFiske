import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FishingMethodsDetailPage } from './fishing-methods-detail';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    FishingMethodsDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(FishingMethodsDetailPage),
    ComponentsModule,
  ],
})
export class FishingMethodsDetailPageModule {}
