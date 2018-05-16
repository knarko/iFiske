import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AreasCountiesPage } from './areas-counties';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [AreasCountiesPage],
  imports: [IonicPageModule.forChild(AreasCountiesPage), TranslateModule.forChild()],
})
export class AreasCountiesPageModule {}
