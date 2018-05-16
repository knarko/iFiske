import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminPermitPage } from './admin-permit';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [AdminPermitPage],
  imports: [IonicPageModule.forChild(AdminPermitPage), TranslateModule, ComponentsModule, PipesModule],
})
export class AdminPermitPageModule {}
