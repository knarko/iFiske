import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InformationProvider } from '../../providers/information/information';

/**
 * Generated class for the InformationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  defaultHistory: ['HomePage'],
})
@Component({
  selector: 'page-information',
  templateUrl: 'information.html',
})
export class InformationPage {
  title: string;
  items: any[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private info: InformationProvider,
  ) {}

  ionViewWillEnter() {
    this.info.getAll().then((info) => {
      this.items = info;
    });
    this.title = this.info.getTitle();
  }

  goto(item) {
    this.navCtrl.push('InformationDetailPage', item);
  }
}
