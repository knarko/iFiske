import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ReportIssuePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  defaultHistory: ['HomePage', 'SettingsPage'],
})
@Component({
  selector: 'page-report-issue',
  templateUrl: 'report-issue.html',
})
export class ReportIssuePage {
  constructor(public navCtrl: NavController, public navParams: NavParams) {}
}
