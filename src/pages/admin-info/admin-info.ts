import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { UserProvider, User } from '../../providers/user/user';
import { AdminProvider } from '../../providers/admin/admin';


@IonicPage({
  segment: 'admin-info',
})
@Component({
  selector: 'page-admin-info',
  templateUrl: 'admin-info.html',
})
export class AdminInfoPage {
  user: Promise<User>;

  currentOrganization = this.adminProvider.currentOrganization;
  numberOfOrganizations = this.adminProvider.numberOfOrganizations;
  pickOrganization = this.adminProvider.pickOrganization;

  constructor(
    private adminProvider: AdminProvider,
    private userProvider: UserProvider,
  ) { }

  ionViewWillEnter() {
    this.user = this.userProvider.getInfo();
  }

}
