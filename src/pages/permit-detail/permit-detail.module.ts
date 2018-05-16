import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PermitDetailPage } from './permit-detail';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../../pipes/pipes.module';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [PermitDetailPage],
  imports: [IonicPageModule.forChild(PermitDetailPage), TranslateModule, ComponentsModule, PipesModule],
})
export class PermitDetailPageModule {}
