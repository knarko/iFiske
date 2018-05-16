import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserProvider, Permit } from '../../providers/user/user';
import { serverLocation } from '../../providers/api/serverLocation';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';

@IonicPage({
  defaultHistory: ['HomePage', 'MyPermitsPage'],
  segment: 'permit-detail/:ID',
})
@Component({
  selector: 'page-permit-detail',
  templateUrl: 'permit-detail.html',
})
export class PermitDetailPage {
  serverLocation = serverLocation;

  permit: Permit;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userProvider: UserProvider,
    private modalCtrl: ModalController,
  ) {}

  async ionViewWillEnter() {
    this.permit = this.navParams.data;
    if (!this.permit) {
      // Ingen indata alls, det här kommer garanterat inte att fungera
    } else if (!this.permit.t) {
      // Ingen titel, det saknas data) {
      if (this.permit.ID) {
        // Det finns ett ID, hämta data från DB
        this.permit = await this.userProvider.getProduct(this.navParams.get('ID'));
      } else {
        // Vi kan inte hämta data på något bra sätt, visa fel
      }
    }
    console.log(this.permit);
  }

  openRules() {
    this.modalCtrl
      .create('PermitRulesPage', {
        t: this.permit.rule_t,
        d: this.permit.rule_d,
        ver: this.permit.rule_ver,
      })
      .present();
  }
}
