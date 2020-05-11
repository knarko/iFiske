import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InformationProvider } from '../../providers/information/information';

/**
 * Generated class for the InformationDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  segment: 'information/detail/:ID',
  defaultHistory: ['HomePage', 'InformationPage'],
})
@Component({
  selector: 'page-information-detail',
  templateUrl: 'information-detail.html',
})
export class InformationDetailPage {
  item: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private info: InformationProvider,
  ) {
    if (!this.navParams.get('t')) {
      this.info
        .getOne(this.navParams.get('ID'))
        .then((info) => (this.item = info));
    } else {
      this.item = this.navParams.data;
    }
  }
}
