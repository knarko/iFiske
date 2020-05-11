import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TechniqueProvider } from '../../providers/technique/technique';

@IonicPage({
  defaultHistory: ['HomePage'],
})
@Component({
  selector: 'page-fishing-methods',
  templateUrl: 'fishing-methods.html',
})
export class FishingMethodsPage {
  items: any[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private tech: TechniqueProvider,
  ) {
    this.tech.getAll().then((tech) => (this.items = tech));
  }

  goto(item) {
    this.navCtrl.push('FishingMethodsDetailPage', item);
  }
}
