import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FishingMethodsPage } from './fishing-methods';
import { TranslateModule } from '@ngx-translate/core';
import { ImgcacheModule } from '../../imgcache/imgcache.module';

@NgModule({
  declarations: [FishingMethodsPage],
  imports: [IonicPageModule.forChild(FishingMethodsPage), TranslateModule.forChild(), ImgcacheModule],
})
export class FishingMethodsPageModule {}
