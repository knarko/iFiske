import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { AdminBasePage } from '../admin/admin-base';
import { AdminProvider } from '../../providers/admin/admin';
import { UserProvider, User } from '../../providers/user/user';


@IonicPage({
  segment: 'admin-info',
})
@Component({
  selector: 'page-admin-info',
  templateUrl: 'admin-info.html',
})
export class AdminInfoPage extends AdminBasePage {
  user: Promise<User>;

  constructor(
    adminProvider: AdminProvider,
    navCtrl: NavController,
    private userProvider: UserProvider,
  ) {
    super(adminProvider, navCtrl);
  }

  ionViewWillEnter() {
    this.user = this.userProvider.getInfo();
  }

}
