import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FishingMethodsDetailPage } from './fishing-methods-detail';
import { ComponentsModule } from '../../components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    FishingMethodsDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(FishingMethodsDetailPage),
    TranslateModule.forChild(),
    ComponentsModule,
  ],
})
export class FishingMethodsDetailPageModule {}
