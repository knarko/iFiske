import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AreasFavoritesPage } from './areas-favorites';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [AreasFavoritesPage],
  imports: [IonicPageModule.forChild(AreasFavoritesPage), TranslateModule.forChild()],
})
export class AreasFavoritesPageModule {}
