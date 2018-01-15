import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateLoadingController } from '../../providers/translate-loading-controller/translate-loading-controller';
import { AdminProvider } from '../../providers/admin/admin';
import { Permit } from '../../providers/user/user';
import { TranslateToastController } from '../../providers/translate-toast-controller/translate-toast-controller';
import { TranslateAlertController } from '../../providers/translate-alert-controller/translate-alert-controller';

@IonicPage({
  defaultHistory: ['HomePage', 'AdminPage'],
  segment: 'admin-permit/:code',
})
@Component({
  selector: 'page-admin-permit',
  templateUrl: 'admin-permit.html',
})
export class AdminPermitPage {
  code: string;

  permit: Permit;
  failed = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: TranslateLoadingController,
    private adminProvider: AdminProvider,
    private toastCtrl: TranslateToastController,
    private alertCtrl: TranslateAlertController,
  ) {
    this.code = this.navParams.get('code');
    if (this.code) {
      this.loadPermit();
    } else {
      this.failed = true;
    }
  }

  async loadPermit() {
    const loading = await this.loadingCtrl.show({
      content: 'loadpermit',
    });

    try {
      const permit = await this.adminProvider.getPermit(this.code);
      this.permit = permit;
    } catch (err) {
      console.warn(err);
      this.toastCtrl.show({
        message: err.response,
        duration: 6000,
      });
      this.failed = true;
    } finally {
      loading.dismiss();
    }
  }

  async revoke(status: boolean) {
    const alert = await this.alertCtrl.show({
      title: 'Are you sure?',
      message: `This will ${status ? 'revoke' : 'unrevoke'} the permit`,
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: status ? 'Revoke' : 'Unrevoke',
          role: 'confirm',
        },
      ],
    });
      const role = await new Promise((resolve) => {
        alert.onDidDismiss((_, role) => resolve(role));
      });
      if (role !== 'confirm') {
        return;
      }

    const loading = await this.loadingCtrl.show({
      content: status ? 'Revoking' : 'Unrevoking',
    });
    try {
      await this.adminProvider.revokePermit(this.permit, status);
      await this.loadPermit()
    } finally {
      loading.dismiss();
    }
  }
}
