import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateAccountPage } from './create-account';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    CreateAccountPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateAccountPage),
    TranslateModule,
    ComponentsModule,
  ],
})
export class CreateAccountPageModule {}
