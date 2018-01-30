import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { serverLocation } from '../../providers/api/serverLocation';
import { AdminProvider } from '../../providers/admin/admin';
import { AdminBasePage } from '../admin/admin-base';

@IonicPage()
@Component({
  selector: 'page-admin-stats',
  templateUrl: 'admin-stats.html',
})
export class AdminStatsPage extends AdminBasePage {
  serverLocation = serverLocation;

  constructor(
    navCtrl: NavController,
    adminProvider: AdminProvider,
  ) {
    super(adminProvider, navCtrl);
  }
}
