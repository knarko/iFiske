import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Refresher } from 'ionic-angular';
import { Product } from '../../providers/product/product';
import { UserProvider } from '../../providers/user/user';

@IonicPage({
  defaultHistory: ['HomePage'],
})
@Component({
  selector: 'page-my-permits',
  templateUrl: 'my-permits.html',
})
export class MyPermitsPage {

  permits = [
    {title: 'Active', permits: [], icon: 'checkmark'},
    {title: 'Inactive', permits: [], icon: 'clock'},
    {title: 'Expired', permits: [], icon: 'close'},
    {title: 'Revoked', permits: [], icon: 'close'},
  ]

  allPermits: any[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userProvider: UserProvider,
  ) { }

  ionViewWillEnter() {
    this.update();
  }

  async refresh(refresher: Refresher) {
    await this.userProvider.update(true);
    await this.update();
    refresher.complete();
  }
  update = async () => {
    const permits = await this.userProvider.getProducts();
    for (const type of this.permits) {
      type.permits = [];
    }

    for (const permit of permits) {
      this.permits.find(p => p.title.toLocaleLowerCase() === permit.validity).permits.push(permit);
    }
    this.allPermits = permits;
  }

  gotoPermit(permit: Product) {
    this.navCtrl.push('PermitDetailPage', permit);
  }
}
