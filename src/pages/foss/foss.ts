import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage({
  defaultHistory: ['HomePage', 'SettingsPage', 'AboutPage'],
})
@Component({
  selector: 'page-foss',
  templateUrl: 'foss.html',
})
export class FossPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // TODO: load them somehow
  }

}
