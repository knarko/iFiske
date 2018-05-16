import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AreasDetailSpeciesPage } from './areas-detail-species';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';
import { ImgcacheModule } from '../../imgcache/imgcache.module';

@NgModule({
  declarations: [AreasDetailSpeciesPage],
  imports: [
    IonicPageModule.forChild(AreasDetailSpeciesPage),
    TranslateModule.forChild(),
    ComponentsModule,
    ImgcacheModule,
  ],
})
export class AreasDetailSpeciesPageModule {}
