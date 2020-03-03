import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { CountyProvider, County } from '../../providers/county/county';
import { MunicipalityProvider } from '../../providers/municipality/municipality';

@IonicPage()
@Component({
  selector: 'page-areas-counties',
  templateUrl: 'areas-counties.html',
})
export class AreasCountiesPage {
  items: County[];

  constructor(
    private navCtrl: NavController,
    private county: CountyProvider,
    private muni: MunicipalityProvider,
  ) {}

  async ionViewWillEnter() {
    this.items = await this.county.getAll();
    this.muni.getAll(this.items[0].ID).then(console.log);
  }

  goto(county: County) {
    this.navCtrl.push('AreasSearchPage', { county, ID: county.ID });
  }
}
