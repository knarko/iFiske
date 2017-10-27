import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AreaProvider, Area } from '../../providers/area/area';

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
  areas: Promise<Area[]>;

  mapOptions: any;


  constructor(public navCtrl: NavController, public navParams: NavParams, private area: AreaProvider) {
  }

  ionViewWillEnter() {
    this.areas = this.area.getAll();
  }

  ionViewDidEnter() {
    this.areas.then(areas => {
      this.mapOptions = { areas };
    }, err => console.warn(err));
  }

}
