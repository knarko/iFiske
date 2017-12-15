import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyPermitsPage } from './my-permits';

@NgModule({
  declarations: [
    MyPermitsPage,
  ],
  imports: [
    IonicPageModule.forChild(MyPermitsPage),
  ],
})
export class MyPermitsPageModule {}
