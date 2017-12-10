import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfirmPasswordRecoveryPage } from './confirm-password-recovery';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    ConfirmPasswordRecoveryPage,
  ],
  imports: [
    IonicPageModule.forChild(ConfirmPasswordRecoveryPage),
    TranslateModule,
    ComponentsModule,
  ],
})
export class ConfirmPasswordRecoveryPageModule {}
