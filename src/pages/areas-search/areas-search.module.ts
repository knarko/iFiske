import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AreasSearchPage } from './areas-search';
import { PipesModule } from '../../pipes/pipes.module';
import { ComponentsModule } from '../../components/components.module';
import { TranslateModule } from '@ngx-translate/core';
import { ImgcacheModule } from '../../imgcache/imgcache.module';

@NgModule({
  declarations: [
    AreasSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(AreasSearchPage),
    TranslateModule.forChild(),
    ComponentsModule,
    PipesModule,
    ImgcacheModule,
  ],
})
export class AreasSearchPageModule {}
