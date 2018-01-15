import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminCheckPage } from './admin-check';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AdminCheckPage,
  ],
  imports: [
    IonicPageModule.forChild(AdminCheckPage),
    TranslateModule,
  ],
})
export class AdminCheckPageModule {}
