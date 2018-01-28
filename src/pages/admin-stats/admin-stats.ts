import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular';
import { serverLocation } from '../../providers/api/serverLocation';
import { AdminProvider, AdminOrganization } from '../../providers/admin/admin';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-admin-stats',
  templateUrl: 'admin-stats.html',
})
export class AdminStatsPage {
  currentOrganization: Observable<AdminOrganization>;
  numberOfOrganizations = this.adminProvider.numberOfOrganizations;

  @ViewChild(Navbar) navbar: Navbar;

  serverLocation = serverLocation;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private adminProvider: AdminProvider,
  ) { }

  pickOrganization() {
    this.adminProvider.pickOrganization();
  }

  ionViewDidLoad() {
    this.currentOrganization = this.adminProvider.currentOrganization;
    this.navbar.backButtonClick = () => {
      this.navCtrl.parent.viewCtrl.dismiss();
    }
  }

}
