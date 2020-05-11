import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AreasDetailPermitPage } from './areas-detail-permit';
import { PipesModule } from '../../pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [AreasDetailPermitPage],
  imports: [
    IonicPageModule.forChild(AreasDetailPermitPage),
    TranslateModule.forChild(),
    PipesModule,
    ComponentsModule,
  ],
})
export class AreasDetailPermitPageModule {}
