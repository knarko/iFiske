import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyPermitsPage } from './my-permits';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [MyPermitsPage],
  imports: [IonicPageModule.forChild(MyPermitsPage), TranslateModule],
})
export class MyPermitsPageModule {}
