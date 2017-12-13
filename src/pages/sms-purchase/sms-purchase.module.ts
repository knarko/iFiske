import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SmsPurchasePage } from './sms-purchase';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SmsPurchasePage,
  ],
  imports: [
    IonicPageModule.forChild(SmsPurchasePage),
    TranslateModule,
  ],
})
export class SmsPurchasePageModule {}
