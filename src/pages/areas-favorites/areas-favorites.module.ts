import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AreasFavoritesPage } from './areas-favorites';

@NgModule({
  declarations: [
    AreasFavoritesPage,
  ],
  imports: [
    IonicPageModule.forChild(AreasFavoritesPage),
  ],
})
export class AreasFavoritesPageModule {}
