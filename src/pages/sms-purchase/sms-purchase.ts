import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

import { Product } from '../../providers/product/product';
import { RegionProvider } from '../../providers/region/region';

@IonicPage()
@Component({
  selector: 'page-sms-purchase',
  templateUrl: 'sms-purchase.html',
})
export class SmsPurchasePage {
  product: Product;

  SMS_PURCHASE_NUMBER = '72456';

  currency$ = this.region.currency$;
  constructor(
    private viewCtrl: ViewController,
    private navParams: NavParams,
    private region: RegionProvider,
  ) {
    this.product = this.navParams.get('product');
  }

  close() {
    return this.viewCtrl.dismiss();
  }
}
