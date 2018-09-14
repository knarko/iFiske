import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading } from 'ionic-angular';
import { TranslateLoadingController } from '../../providers/translate-loading-controller/translate-loading-controller';
import { AdminProvider } from '../../providers/admin/admin';
import { AdminPermit } from '../../providers/admin/adminTypes';
import { TranslateToastController } from '../../providers/translate-toast-controller/translate-toast-controller';
import { TranslateAlertController } from '../../providers/translate-alert-controller/translate-alert-controller';
import { Observable } from 'rxjs/Observable';
import { TimeoutError } from '../../errors';
import { ApiError, IFISKE_ERRORS } from '../../providers/api/api';

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

  permit: Observable<AdminPermit>;
  failed = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: TranslateLoadingController,
    private adminProvider: AdminProvider,
    private toastCtrl: TranslateToastController,
    private alertCtrl: TranslateAlertController,
  ) {}

  ionViewWillEnter() {
    this.code = this.navParams.get('code');
    if (this.code) {
      this.loadPermit();
    } else {
      this.failed = true;
    }
  }

  async loadPermit() {
    this.permit = this.adminProvider.getPermit(this.code);

    let loading: Loading;
    let dismissed = false;

    let timeout = setTimeout(async () => {
      loading = await this.loadingCtrl.create({
        content: 'Loading',
      });
      if (!dismissed) {
        loading.present();
      } else {
        dismissLoading();
      }
    }, 100);

    const dismissLoading = () => {
      dismissed = true;
      if (timeout != undefined) {
        clearTimeout(timeout);
        timeout = undefined;
      }
      if (loading) {
        loading.dismiss();
        loading = undefined;
      }
    };

    this.permit.subscribe(
      () => {
        dismissLoading();
      },
      (err: ApiError) => {
        dismissLoading();

        this.failed = true;

        console.warn(err);
        if (err.error_code !== IFISKE_ERRORS.INSUFFICIENT_USER_ACCESS_LEVEL) {
          this.toastCtrl.show({
            message: err.response,
            duration: 6000,
          });
        }
      },
    );
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
    const role = await new Promise(resolve => {
      alert.onDidDismiss((_, role) => resolve(role));
    });
    if (role !== 'confirm') {
      return;
    }

    const loading = await this.loadingCtrl.show({
      content: status ? 'Revoking' : 'Unrevoking',
    });
    try {
      await this.adminProvider.revokePermit(this.code, status);
      await this.loadPermit();
    } catch (err) {
      if (err.name === TimeoutError.name) {
        this.toastCtrl.show({
          message: 'errors.network',
          duration: 4000,
        });
      }
    } finally {
      loading.dismiss();
    }
  }
}
