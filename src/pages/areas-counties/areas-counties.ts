import { Component } from '@angular/core';
import { IonicPage, NavParams, NavController } from 'ionic-angular';
import { CountyProvider, County } from '../../providers/county/county';

@IonicPage()
@Component({
  selector: 'page-areas-counties',
  templateUrl: 'areas-counties.html',
})
export class AreasCountiesPage {
  items: County[];

  constructor(private navCtrl: NavController, private county: CountyProvider) {}

  async ionViewWillEnter() {
    this.items = await this.county.getAll();
  }

  goto(county: County) {
    this.navCtrl.push('AreasSearchPage', { county, ID: county.ID });
  }
}
