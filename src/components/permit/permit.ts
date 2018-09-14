import { Component, Input, EventEmitter, Output } from '@angular/core';
import { SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

import { Permit } from '../../providers/user/userTypes';
import { OrganizationProvider, Organization } from '../../providers/organization/organization';
import { serverLocation } from '../../providers/api/serverLocation';
import { AreaProvider } from '../../providers/area/area';
import { DeepLinks, DeepLinksProvider } from '../../providers/deep-links/deep-links';

@Component({
  selector: 'app-permit',
  templateUrl: 'permit.html',
})
export class PermitComponent {
  qr: string;

  @Input()
  admin: boolean = false;
  @Input()
  permit: Permit;
  @Output()
  revoke = new EventEmitter<boolean>();
  org?: Organization;
  serverLocation = serverLocation;

  constructor(
    private organizationProvider: OrganizationProvider,
    private areaProvider: AreaProvider,
    private ga: GoogleAnalytics,
    private deepLinks: DeepLinksProvider,
  ) {}

  async ngOnChanges(changes: SimpleChanges) {
    if (changes.permit.currentValue) {
      this.updateQR();
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

  private updateQR() {
    this.qr = `data:image/png;base64,${this.permit.qr}`;
  }

  openProductInBrowser() {
    console.log('Opening product!', this.permit.pid);
    this.ga.trackEvent('Purchase', 'Web', '' + this.permit.pid);

    this.deepLinks.open(DeepLinks.buy, { productId: '' + this.permit.pid }, { bringSession: true });
  }

  openCatchReport() {
    this.deepLinks.open(DeepLinks.catchReport, { ID: '' + this.permit.code }, { bringSession: true });
  }
}
