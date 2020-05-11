import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminPermitListPage } from './admin-permit-list';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [AdminPermitListPage],
  imports: [
    IonicPageModule.forChild(AdminPermitListPage),
    TranslateModule,
    ComponentsModule,
  ],
})
export class AdminPermitListPageModule {}
