import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  Refresher,
  Loading,
} from 'ionic-angular';
import { Product } from '../../providers/product/product';
import { UserProvider } from '../../providers/user/user';
import { TranslateLoadingController } from '../../providers/translate-loading-controller/translate-loading-controller';
import { MonitoringClient } from '../../app/monitoring';
import { TimeoutError } from '../../errors';
import { TranslateToastController } from '../../providers/translate-toast-controller/translate-toast-controller';

@IonicPage({
  defaultHistory: ['HomePage'],
})
@Component({
  selector: 'page-my-permits',
  templateUrl: 'my-permits.html',
})
export class MyPermitsPage {
  permits = [
    { title: 'active', permits: [], icon: 'checkmark' },
    { title: 'inactive', permits: [], icon: 'clock' },
    { title: 'expired', permits: [], icon: 'close' },
    { title: 'revoked', permits: [], icon: 'close' },
  ];

  allPermits: any[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userProvider: UserProvider,
    private loadingCtrl: TranslateLoadingController,
    private toastCtrl: TranslateToastController,
  ) {}

  ionViewWillEnter() {
    this.update();
    this.refresh();
  }

  async refresh(refresher?: Refresher) {
    let loading: Promise<Loading>;
    try {
      if (!refresher) {
        loading = this.loadingCtrl.show({ content: 'Updating' });
      }
      await this.userProvider.update(true);
      await this.update();
    } catch (error) {
      if (error.name === TimeoutError.name) {
        this.toastCtrl.show({
          message: 'errors.network',
          duration: 4000,
        });
      } else {
        MonitoringClient.captureException(error);
      }
    } finally {
      if (refresher) {
        refresher.complete();
      } else {
        (await loading).dismiss();
      }
    }
  }

  update = async () => {
    const permits = await this.userProvider.getProducts();
    for (const type of this.permits) {
      type.permits = [];
    }

    for (const permit of permits) {
      this.permits
        .find((p) => p.title === permit.validity)
        .permits.push(permit);
    }
    this.allPermits = permits;
  };

  gotoPermit(permit: Product) {
    this.navCtrl.push('PermitDetailPage', permit);
  }
}
