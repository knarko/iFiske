import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AreasCountiesPage } from './areas-counties';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [AreasCountiesPage],
  imports: [IonicPageModule.forChild(AreasCountiesPage), TranslateModule.forChild(), ComponentsModule],
})
export class AreasCountiesPageModule {}
