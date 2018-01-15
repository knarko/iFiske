import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateAccountDetailsPage } from './create-account-details';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    CreateAccountDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateAccountDetailsPage),
    TranslateModule,
    ComponentsModule,
  ],
})
export class CreateAccountDetailsPageModule {}
