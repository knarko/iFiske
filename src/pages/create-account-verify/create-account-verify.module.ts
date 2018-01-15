import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateAccountVerifyPage } from './create-account-verify';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    CreateAccountVerifyPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateAccountVerifyPage),
    TranslateModule,
    ComponentsModule,
  ],
})
export class CreateAccountVerifyPageModule {}
