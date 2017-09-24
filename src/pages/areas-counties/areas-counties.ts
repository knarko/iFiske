import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CountyProvider, County } from '../../providers/county/county';

@IonicPage()
@Component({
  selector: 'page-areas-counties',
  templateUrl: 'areas-counties.html',
})
export class AreasCountiesPage {
  navCtrl: any;
  static title = 'Counties';
  static icon = 'fishing';

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

  goto(item: County) {
    this.navCtrl.push('AreasSearchPage', {county: item});
  }
}
