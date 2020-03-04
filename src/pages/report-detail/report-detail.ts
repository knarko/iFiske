import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Component } from '@angular/core';
import { Report } from '../../providers/reports/reports';

@IonicPage({
  segment: 'report-detail/:ID',
  defaultHistory: ['HomePage'],
})
@Component({
  selector: 'page-report-detail',
  templateUrl: './report-detail.html',
})
export class ReportDetailPage {
  report: Report;
  constructor(private navParams: NavParams, private navCtrl: NavController) {
    this.report = this.navParams.data;
    console.log(this.report);
  }

  openTechnique(report: Report) {
    this.navCtrl.push('FishingMethodsDetailPage', { ID: report.tech });
  }
}
