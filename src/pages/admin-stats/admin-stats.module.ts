import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminStatsPage } from './admin-stats';
import { ComponentsModule } from '../../components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [AdminStatsPage],
  imports: [IonicPageModule.forChild(AdminStatsPage), TranslateModule, ComponentsModule],
})
export class AdminStatsPageModule {}
