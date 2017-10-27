import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Product } from '../../providers/product/product';
import { Area } from '../../providers/area/area';

/**
 * Generated class for the AreasDetailLicensePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-areas-detail-license',
  templateUrl: 'areas-detail-license.html',
})
export class AreasDetailLicensePage {
  area: Area;
  products: Product[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.navParams.get('params').subscribe(({ area, org, products }) => {
      this.area = area;
      this.products = products;
    });
  }

  buy(product: Product, method: {b}) {
    // TODO: do anything
    console.log('buy', product, method);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AreasDetailLicensePage');
  }

}
