import { Component, Input, EventEmitter, Output } from '@angular/core';
import { SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';

import { Permit } from '../../providers/user/userTypes';
import { OrganizationProvider, Organization } from '../../providers/organization/organization';
import { serverLocation } from '../../providers/api/serverLocation';
import { AreaProvider } from '../../providers/area/area';
import { DeepLinks, DeepLinksProvider } from '../../providers/deep-links/deep-links';
import { GoogleAnalytics } from '../../providers/google-analytics/google-analytics';
import { SettingsProvider } from '../../providers/settings/settings';
import { flip } from '../../animations/flip';
import { AdminPermit } from '../../providers/admin/adminTypes';

type NotPermitted<T> = { [P in keyof T]?: undefined };
@Component({
  selector: 'app-permit',
  templateUrl: 'permit.html',
  animations: [flip('showFront'), flip('showBack', false)],
})
export class PermitComponent {
  logged: boolean = false;
  qr: string;

  @Input()
  admin: boolean = false;
  @Input()
  permit: Permit | AdminPermit & NotPermitted<Permit>;
  @Output()
  revoke = new EventEmitter<boolean>();
  org?: Organization;
  serverLocation = serverLocation;

  show = 'first';
  constructor(
    private organizationProvider: OrganizationProvider,
    private areaProvider: AreaProvider,
    private ga: GoogleAnalytics,
    private deepLinks: DeepLinksProvider,
    private settings: SettingsProvider,
  ) {}

  async ngOnChanges(changes: SimpleChanges) {
    if (changes.permit && changes.permit.currentValue) {
      this.logged = false;
      try {
        if (this.permit.ai != undefined) {
          this.org = await this.areaProvider
            .getOne(this.permit.ai)
            .then(area => this.organizationProvider.getOne(area.orgid));
        }
      } catch (e) {
        // Don't do anything
      }
    }
  }

  openProductInBrowser() {
    console.log('Opening product!', this.permit.pid);
    this.ga.trackEvent('Purchase', 'Web', '' + this.permit.pid);

    this.deepLinks.open(DeepLinks.buy, { productId: '' + this.permit.pid }, { bringSession: true });
  }

  openCatchReport() {
    this.deepLinks.open(DeepLinks.catchReport, { ID: '' + this.permit.code }, { bringSession: true });
    const url = `${serverLocation}/mobile/index.php?lang=${this.settings.language}&p=5&i=${this.permit.pid}`;
    window.open(url, '_system');
    // TODO: analytics
    // analytics.trackEvent('Purchase', 'Web', id);
  }

  log() {
    this.logged = true;
  }

  flip() {
    this.show = this.show === 'first' ? 'second' : 'first';
  }
  animatingQR = false;
  animateQR() {
    if (this.animatingQR) {
      this.animatingQR = false;
      setTimeout(() => this.animateQR(), 50);
      return;
    }
    this.animatingQR = true;
    setTimeout(() => (this.animatingQR = false), 1000);
  }
}
