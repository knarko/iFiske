import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Fish, FishProvider } from '../../providers/fish/fish';

/**
 * Generated class for the SpeciesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  defaultHistory: ['HomePage'],
})
@Component({
  selector: 'page-species',
  templateUrl: 'species.html',
})
export class SpeciesPage {
  items: Fish[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private fish: FishProvider) {
  }

  async ngOnInit() {
    this.items = await this.fish.getAll();
  }

  goto(item) {
    this.navCtrl.push('SpeciesDetailPage', item);
  }
}
