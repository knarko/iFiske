import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyPermitsPage } from './my-permits';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [MyPermitsPage],
  imports: [IonicPageModule.forChild(MyPermitsPage), TranslateModule, ComponentsModule],
})
export class MyPermitsPageModule {}
