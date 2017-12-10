import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReportIssuePage } from './report-issue';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ReportIssuePage,
  ],
  imports: [
    IonicPageModule.forChild(ReportIssuePage),
    TranslateModule,
  ],
})
export class ReportIssuePageModule {}
