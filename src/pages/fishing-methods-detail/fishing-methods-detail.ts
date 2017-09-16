import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TechniqueProvider } from '../../providers/technique/technique';

/**
 * Generated class for the FishingMethodsDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  segment: 'fishing-methods/detail/:ID',
  defaultHistory: ['HomePage', 'FishingMethodsPage'],
})
@Component({
  selector: 'page-fishing-methods-detail',
  templateUrl: 'fishing-methods-detail.html',
})
export class FishingMethodsDetailPage {
  tech: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private techProvider: TechniqueProvider) {
    if (!this.navParams.get('t')) {
      this.techProvider.getOne(this.navParams.get('ID'))
      .then(tech => this.tech = tech);
    } else {
      this.tech = this.navParams.data;
    }
  }
}
