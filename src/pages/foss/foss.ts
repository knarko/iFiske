import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';


@IonicPage({
  defaultHistory: ['HomePage', 'SettingsPage', 'AboutPage'],
})
@Component({
  selector: 'page-foss',
  templateUrl: 'foss.html',
})
export class FossPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private statusBar: StatusBar,
  ) {
    // TODO: load them somehow
  }

  ionViewDidEnter() {
    this.statusBar.styleDefault();
  }

  ionViewWillLeave() {
    this.statusBar.styleBlackTranslucent();
  }

}
