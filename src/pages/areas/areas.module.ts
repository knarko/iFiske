import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AreasPage } from './areas';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [AreasPage],
  imports: [IonicPageModule.forChild(AreasPage), TranslateModule.forChild()],
})
export class AreasPageModule {}
