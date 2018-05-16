import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';

@IonicPage()
@Component({
  selector: 'page-permit-rules',
  templateUrl: 'permit-rules.html',
})
export class PermitRulesPage {
  rules: {
    ver: number;
    d: string;
    t: string;
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
    this.rules = this.navParams.data;
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
