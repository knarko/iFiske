import { Component, ViewChild, EventEmitter, Output } from '@angular/core';
import { NavController, Navbar } from 'ionic-angular';

import { Observable } from "rxjs/Observable";
import { AdminProvider, AdminOrganization } from '../../providers/admin/admin';

@Component({
  selector: 'admin-header',
  templateUrl: 'admin-header.html',
})
export class AdminHeaderComponent {
  @ViewChild(Navbar) private _navbar: Navbar;
  @Output() back = new EventEmitter<void>();

  public currentOrganization: Observable<AdminOrganization>;
  public numberOfOrganizations = this.adminProvider.numberOfOrganizations;

  constructor(private adminProvider: AdminProvider, private navCtrl: NavController) { }


  pickOrganization() {
    this.adminProvider.pickOrganization();
  }

  ngAfterViewInit() {
    this.currentOrganization = this.adminProvider.currentOrganization;
    this._navbar.backButtonClick = () => {
      this.navCtrl.parent.viewCtrl.dismiss();
      this.back.emit();
    }
  }
}
