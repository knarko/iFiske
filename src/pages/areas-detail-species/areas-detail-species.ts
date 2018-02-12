import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Fish } from '../../providers/fish/fish';

@IonicPage()
@Component({
  selector: 'page-areas-detail-species',
  templateUrl: 'areas-detail-species.html',
})
export class AreasDetailSpeciesPage {
  items: Fish[];

  private navCtrl: NavController;

  constructor(
    private navParams: NavParams,
  ) {
    this.navParams.get('params').subscribe(({ species, rootNavCtrl }) => {
      this.navCtrl = rootNavCtrl;
      this.items = species;
      console.log(this);
    });
  }

  goto(fish: Fish) {
    this.navCtrl.push('SpeciesDetailPage', fish);
  }
}
