import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AreasFavoritesPage } from './areas-favorites';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [AreasFavoritesPage],
  imports: [
    IonicPageModule.forChild(AreasFavoritesPage),
    TranslateModule.forChild(),
    ComponentsModule,
  ],
})
export class AreasFavoritesPageModule {}
