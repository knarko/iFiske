import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AreasSearchPage } from './areas-search';
import { PipesModule } from '../../pipes/pipes.module';
import { ComponentsModule } from '../../components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AreasSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(AreasSearchPage),
    TranslateModule.forChild(),
    ComponentsModule,
    PipesModule,
  ],
})
export class AreasSearchPageModule {}
