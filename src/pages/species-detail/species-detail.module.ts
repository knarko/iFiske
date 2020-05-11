import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SpeciesDetailPage } from './species-detail';
import { TranslateModule } from '@ngx-translate/core';
import { ImgcacheModule } from '../../imgcache/imgcache.module';

@NgModule({
  declarations: [SpeciesDetailPage],
  imports: [
    IonicPageModule.forChild(SpeciesDetailPage),
    TranslateModule.forChild(),
    ImgcacheModule,
  ],
})
export class SpeciesDetailPageModule {}
