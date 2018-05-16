import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SpeciesPage } from './species';
import { TranslateModule } from '@ngx-translate/core';
import { ImgcacheModule } from '../../imgcache/imgcache.module';

@NgModule({
  declarations: [SpeciesPage],
  imports: [IonicPageModule.forChild(SpeciesPage), TranslateModule.forChild(), ImgcacheModule],
})
export class SpeciesPageModule {}
