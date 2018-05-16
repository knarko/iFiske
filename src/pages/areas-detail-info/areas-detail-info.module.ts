import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AreasDetailInfoPage } from './areas-detail-info';
import { PipesModule } from '../../pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';
import { ImgcacheModule } from '../../imgcache/imgcache.module';

@NgModule({
  declarations: [AreasDetailInfoPage],
  imports: [
    IonicPageModule.forChild(AreasDetailInfoPage),
    TranslateModule.forChild(),
    PipesModule,
    ComponentsModule,
    ImgcacheModule,
  ],
})
export class AreasDetailInfoPageModule {}
