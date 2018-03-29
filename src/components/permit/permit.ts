import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Permit } from '../../providers/user/user';
import { OrganizationProvider, Organization } from '../../providers/organization/organization';
import { serverLocation } from '../../providers/api/serverLocation';
import { SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { AreaProvider } from '../../providers/area/area';
import { SettingsProvider } from '../../providers/settings/settings';

@Component({
  selector: 'app-permit',
  templateUrl: 'permit.html',
})
export class PermitComponent {
  logged: boolean = false;
  qr: string;

  @Input() admin: boolean = false;
  @Input() adminInfo: any;
  @Input() permit: Permit;
  @Output() revoke = new EventEmitter<boolean>();
  @Output() logCheck = new EventEmitter<void>();
  org?: Organization;
  serverLocation = serverLocation;

  constructor(
    private organizationProvider: OrganizationProvider,
    private areaProvider: AreaProvider,
    private settings: SettingsProvider,
  ) { }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes.permit && changes.permit.currentValue) {
      this.logged = false;
      this.updateQR();
      try {
        this.org = await this.areaProvider.getOne(this.permit.ai)
          .then((area) => this.organizationProvider.getOne(area.orgid));
      } catch (e) {
        // Don't do anything
      }
    }
  }

  private updateQR() {
    this.qr = `data:image/png;base64,${this.permit.qr}`;
  }

  openProductInBrowser() {
    const url = `${serverLocation}/mobile/index.php?lang=${this.settings.language}&p=5&i=${this.permit.pid}`;
    window.open(url, '_system');
    // TODO: analytics
    // analytics.trackEvent('Purchase', 'Web', id);
  }

  log() {
    this.logged = true;
    this.logCheck.emit();
  }
}
