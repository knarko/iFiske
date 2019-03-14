import {
  Component,
  Input,
  EventEmitter,
  Output,
  OnInit,
  OnDestroy,
  OnChanges,
  ElementRef,
  ViewChild,
  NgZone,
} from '@angular/core';
import { SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';

import { Permit } from '../../providers/user/userTypes';
import { OrganizationProvider, Organization } from '../../providers/organization/organization';
import { serverLocation } from '../../providers/api/serverLocation';
import { AreaProvider } from '../../providers/area/area';
import { DeepLinks, DeepLinksProvider } from '../../providers/deep-links/deep-links';
import { SettingsProvider } from '../../providers/settings/settings';
import { flipFront, flipBack } from '../../animations/flip';
import { AdminPermit } from '../../providers/admin/adminTypes';

type NotPermitted<T> = { [P in keyof T]?: undefined };

@Component({
  selector: 'app-permit',
  templateUrl: 'permit.html',
  animations: [flipFront, flipBack],
})
export class PermitComponent implements OnInit, OnDestroy, OnChanges {
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

  @ViewChild('backgroundPosWrapper') backgroundPosWrapper: ElementRef;

  code: string;

  show = 'first';
  constructor(
    private organizationProvider: OrganizationProvider,
    private areaProvider: AreaProvider,
    private deepLinks: DeepLinksProvider,
    private settings: SettingsProvider,
    private ngZone: NgZone,
  ) {}

  private animationFrame;
  private handleDeviceOrientation = (event: DeviceOrientationEvent) => {
    function usefulOrientation(alpha, beta, gamma) {
      alpha -= Number(window.orientation);
      if (window.orientation === 180) {
        return { alpha: alpha, beta: -beta, gamma: -gamma };
      } else if (window.orientation === 90) {
        return { alpha: alpha, beta: -gamma, gamma: beta };
      } else if (window.orientation === -90) {
        return { alpha: alpha, beta: gamma, gamma: -beta };
      } else {
        return { alpha: alpha, beta: beta, gamma: gamma };
      }
    }

    cancelAnimationFrame(this.animationFrame);
    this.animationFrame = requestAnimationFrame(() => {
      if (this.backgroundPosWrapper.nativeElement) {
        let { alpha, beta, gamma } = usefulOrientation(event.alpha, event.beta, event.gamma);
        const value = (1000 * (alpha + beta + gamma)) / 180;

        const nextValue = `${value.toFixed(7)}px center`;
        const el: HTMLDivElement = this.backgroundPosWrapper.nativeElement;
        if (el.style.backgroundPosition !== nextValue) {
          el.style.backgroundPosition = nextValue;
        }
      }
    });
  };
  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('deviceorientation', this.handleDeviceOrientation, true);
    });
  }
  ngOnDestroy() {
    this.ngZone.runOutsideAngular(() => {
      window.removeEventListener('deviceorientation', this.handleDeviceOrientation, true);
    });
  }
  async ngOnChanges(changes: SimpleChanges) {
    // u202F is a thin non-breaking space
    this.code = ('' + this.permit.code).substr(0, 4) + '\u202F' + ('' + this.permit.code).substr(4);
    if (changes.permit && changes.permit.currentValue) {
      this.logged = false;
      try {
        if ((this.permit as AdminPermit).suborgid != undefined) {
          this.org = await this.organizationProvider.getOne((this.permit as AdminPermit).suborgid);
        } else if (this.permit.ai != undefined) {
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
}
