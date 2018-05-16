import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { UserProvider, User } from '../../providers/user/user';
import { AdminProvider } from '../../providers/admin/admin';
import { serverLocation } from '../../providers/api/serverLocation';

@IonicPage({
  segment: 'admin-info',
})
@Component({
  selector: 'page-admin-info',
  templateUrl: 'admin-info.html',
})
export class AdminInfoPage {
  user: Promise<User>;

  serverLocation = serverLocation;

  constructor(public admin: AdminProvider, private userProvider: UserProvider) {}

  ionViewWillEnter() {
    this.user = this.userProvider.getInfo().catch(() => undefined);
  }
}
