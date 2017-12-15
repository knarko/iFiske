import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Fish, FishProvider } from '../../providers/fish/fish';

/**
 * Generated class for the SpeciesDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  segment: 'species/detail/:ID',
  defaultHistory: ['HomePage', 'SpeciesPage'],
})
@Component({
  selector: 'page-species-detail',
  templateUrl: 'species-detail.html',
})
export class SpeciesDetailPage {

  fish: Fish;

  constructor(public navCtrl: NavController, public navParams: NavParams, private fishProvider: FishProvider) {
    if (!this.navParams.get('t')) {
      this.fishProvider.getOne(this.navParams.get('ID'))
      .then(fish => {
        this.fish = fish;
      });
    } else {
      this.fish = this.navParams.data;
    }
  }
}
