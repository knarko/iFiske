import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';

import { Product } from '../../providers/product/product';

@IonicPage()
@Component({
  selector: 'page-sms-purchase',
  templateUrl: 'sms-purchase.html',
})
export class SmsPurchasePage {
  product: Product;

  SMS_PURCHASE_NUMBER = '72456';

  constructor(private viewCtrl: ViewController, private navParams: NavParams) {
    this.product = this.navParams.get('product');
  }

  close() {
    return this.viewCtrl.dismiss();
  }
}
