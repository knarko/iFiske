import { Component } from '@angular/core';
import { IonicPage, NavParams, NavController } from 'ionic-angular';
import { CountyProvider, County } from '../../providers/county/county';

@IonicPage()
@Component({
  selector: 'page-areas-counties',
  templateUrl: 'areas-counties.html',
})
export class AreasCountiesPage {
  navCtrl: NavController;

  items: County[];

  constructor(
    public navParams: NavParams,
    private county: CountyProvider,
  ) {
    this.navCtrl = this.navParams.get('rootNavCtrl');
  }

  async ionViewWillEnter() {
    this.items = await this.county.getAll();
  }

  goto(county: County) {
    this.navCtrl.push('AreasSearchPage', { county, ID: county.ID });
  }
}
