import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AreaProvider } from '../../providers/area/area';

/**
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  defaultHistory: ['HomePage'],
})
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {

  mapOptions: any;


  constructor(public navCtrl: NavController, public navParams: NavParams, private area: AreaProvider) {
  }

  ionViewWillEnter() {
    this.area.getAll()
    .then(areas => {
      this.mapOptions = {
        areas,
      };
    }, err => console.warn(err));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MapPage');
  }

}
