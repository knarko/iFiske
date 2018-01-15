import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular';
import { serverLocation } from '../../providers/api/serverLocation';

@IonicPage()
@Component({
  selector: 'page-admin-stats',
  templateUrl: 'admin-stats.html',
})
export class AdminStatsPage {

  @ViewChild(Navbar) navbar: Navbar;

  serverLocation = serverLocation;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.navbar.backButtonClick = () => {
      this.navCtrl.parent.viewCtrl.dismiss();
    }
  }

}
