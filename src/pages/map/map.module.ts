import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapPage } from './map';
import { ComponentsModule } from '../../components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    MapPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(MapPage),
    TranslateModule.forChild(),
  ],
})
export class MapPageModule {}
