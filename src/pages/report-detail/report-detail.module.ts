import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReportDetailPage } from './report-detail';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../../pipes/pipes.module';
import { ComponentsModule } from '../../components/components.module';
import { ImgcacheModule } from '../../imgcache/imgcache.module';
import { IonicImageViewerModule } from 'ionic-img-viewer/dist/es2015/src/module';

@NgModule({
  declarations: [ReportDetailPage],
  imports: [
    IonicPageModule.forChild(ReportDetailPage),
    TranslateModule.forChild(),
    PipesModule,
    ComponentsModule,
    ImgcacheModule,
    IonicImageViewerModule,
  ],
})
export class SpeciesDetailPageModule {}
