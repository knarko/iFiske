import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminCheckPage } from './admin-check';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [AdminCheckPage],
  imports: [
    IonicPageModule.forChild(AdminCheckPage),
    TranslateModule,
    ComponentsModule,
  ],
})
export class AdminCheckPageModule {}
