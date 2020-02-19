import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { IonicImageViewerModule, ImageViewerComponent } from 'ionic-img-viewer';

import { PipesModule } from '../../pipes/pipes.module';
import { ComponentsModule } from '../../components/components.module';
import { ImgcacheModule } from '../../imgcache/imgcache.module';

import { AreasDetailReportPage } from './areas-detail-report';

@NgModule({
  declarations: [AreasDetailReportPage],
  imports: [
    IonicPageModule.forChild(AreasDetailReportPage),
    TranslateModule.forChild(),
    PipesModule,
    ComponentsModule,
    ImgcacheModule,
    IonicImageViewerModule,
  ],
  entryComponents: [ImageViewerComponent],
})
export class AreasDetailInfoPageModule {}
