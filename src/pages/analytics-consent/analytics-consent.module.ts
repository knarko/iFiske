import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AnalyticsConsentPage } from './analytics-consent';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [AnalyticsConsentPage],
  imports: [IonicPageModule.forChild(AnalyticsConsentPage), TranslateModule],
})
export class AnalyticsConsentPageModule {}
