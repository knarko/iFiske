import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserProvider, Permit } from '../../providers/user/user';
import { serverLocation } from '../../providers/api/serverLocation';
import { SettingsProvider } from '../../providers/settings/settings';
import { OrganizationProvider, Organization } from '../../providers/organization/organization';
import { AreaProvider } from '../../providers/area/area';

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
  qr: string;

  permit: Permit = {} as any;
  org: Organization;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userProvider: UserProvider,
    private settings: SettingsProvider,
    private organizationProvider: OrganizationProvider,
    private areaProvider: AreaProvider,
  ) {
  }

  async ionViewWillEnter() {
    this.permit = this.navParams.data;
    if (!this.permit || !this.permit.t && this.permit.ID) {
      this.permit = await this.userProvider.getProduct(this.navParams.get('ID'))
    }
    this.updateQR();
    console.log(this.permit);
    try {
      this.org = await this.areaProvider.getOne(this.permit.ai)
        .then((area) => {
          return this.organizationProvider.getOne(area.orgid);
        });
    } catch (e) {
      console.warn(e);
      // Don't do anything
    }
    console.log(this.org)
  }

  openProductInBrowser() {
    const url = `${serverLocation}/mobile/index.php?lang=${this.settings.language}&p=5&i=${this.permit.pid}`;
    window.open(url, '_system');
    // TODO: analytics
    // analytics.trackEvent('Purchase', 'Web', id);
  };

  private updateQR() {
    this.qr = `data:image/png;base64,${this.permit.qr}`;
  }
}
