import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { User } from '../../providers/user/userTypes';
import { AdminProvider } from '../../providers/admin/admin';
import {
  DeepLinks,
  DeepLinksProvider,
} from '../../providers/deep-links/deep-links';

@IonicPage({
  segment: 'admin-info',
})
@Component({
  selector: 'page-admin-info',
  templateUrl: 'admin-info.html',
})
export class AdminInfoPage {
  user: Promise<User>;

  constructor(
    public admin: AdminProvider,
    private userProvider: UserProvider,
    private deepLinks: DeepLinksProvider,
  ) {}

  ionViewWillEnter() {
    this.user = this.userProvider.getInfo().catch(() => undefined);
  }
  openControlPanel() {
    this.deepLinks.open(
      DeepLinks.controlPanel,
      { orgId: '' + this.admin.orgId },
      { bringSession: true },
    );
  }
}
