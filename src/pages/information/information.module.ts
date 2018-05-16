import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InformationPage } from './information';
import { PipesModule } from '../../pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
import { ImgcacheModule } from '../../imgcache/imgcache.module';

@NgModule({
  declarations: [InformationPage],
  imports: [IonicPageModule.forChild(InformationPage), TranslateModule.forChild(), PipesModule, ImgcacheModule],
})
export class InformationPageModule {}
