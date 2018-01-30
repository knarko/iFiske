import { ViewChild } from '@angular/core';
import { NavController, Navbar } from 'ionic-angular';

import { Observable } from "rxjs/Observable";
import { AdminProvider, AdminOrganization } from '../../providers/admin/admin';

export class AdminBasePage {
  @ViewChild(Navbar) private _navbar: Navbar;

  public currentOrganization: Observable<AdminOrganization>;
  public numberOfOrganizations = this._adminProvider.numberOfOrganizations;

  constructor(private _adminProvider: AdminProvider, private _navCtrl: NavController) { }


  pickOrganization() {
    this._adminProvider.pickOrganization();
  }

  ionViewDidLoad() {
    this.currentOrganization = this._adminProvider.currentOrganization;
    this._navbar.backButtonClick = () => {
      this._navCtrl.parent.viewCtrl.dismiss();
    }
  }

}
