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
import {
  OrganizationProvider,
  Organization,
} from '../../providers/organization/organization';
import { AreaProvider } from '../../providers/area/area';
import {
  DeepLinks,
  DeepLinksProvider,
} from '../../providers/deep-links/deep-links';
import { flipFront, flipBack } from '../../animations/flip';
import { AdminPermit } from '../../providers/admin/adminTypes';
import { AdminProvider } from '../../providers/admin/admin';
import { TranslateToastController } from '../../providers/translate-toast-controller/translate-toast-controller';
import { RegionProvider } from '../../providers/region/region';

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
  permit: Permit | (AdminPermit & NotPermitted<Permit>);
  @Output()
  revoke = new EventEmitter<boolean>();
  org?: Organization;

  permitPdf?: string;

  @ViewChild('backgroundPosWrapper') backgroundPosWrapper: ElementRef;

  code: string;

  show = 'first';

  currency$ = this.region.currency$;
  constructor(
    private organizationProvider: OrganizationProvider,
    private areaProvider: AreaProvider,
    private deepLinks: DeepLinksProvider,
    private ngZone: NgZone,
    private toastCtrl: TranslateToastController,
    private adminProvider: AdminProvider,
    private region: RegionProvider,
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
        let { alpha, beta, gamma } = usefulOrientation(
          event.alpha,
          event.beta,
          event.gamma,
        );
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
      window.addEventListener(
        'deviceorientation',
        this.handleDeviceOrientation,
        true,
      );
    });
  }
  ngOnDestroy() {
    this.ngZone.runOutsideAngular(() => {
      window.removeEventListener(
        'deviceorientation',
        this.handleDeviceOrientation,
        true,
      );
    });
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes.permit && changes.permit.currentValue) {
      this.logged = false;
      try {
        this.permitPdf = this.region.serverLocation$.value + this.permit.pdf;
        if ((this.permit as AdminPermit).suborgid != undefined) {
          this.org = await this.organizationProvider.getOne(
            (this.permit as AdminPermit).suborgid,
          );
        } else if (this.permit.ai != undefined) {
          this.org = await this.areaProvider
            .getOne(this.permit.ai)
            .then((area) => this.organizationProvider.getOne(area.orgid));
        } else if (this.permit.ot === 'Demoföreningen') {
          this.org = await this.organizationProvider.getOne(1);
        }
      } catch (e) {
        // Don't do anything
      }
    }
  }

  openProductInBrowser() {
    console.log('Opening product!', this.permit.pid);

    this.deepLinks.open(
      DeepLinks.buy,
      { productId: '' + this.permit.pid },
      { bringSession: true },
    );
  }

  openCatchReport() {
    this.deepLinks.open(
      DeepLinks.catchReport,
      { ID: '' + this.permit.code },
      { bringSession: true },
    );
  }

  log() {
    this.logged = true;
  }

  flip() {
    this.show = this.show === 'first' ? 'second' : 'first';
  }

  async addPermitCheck() {
    (this.permit as AdminPermit).ctrl += 1;
    const toast = await this.toastCtrl.show({
      closeButtonText: 'ui.general.undo',
      dismissOnPageChange: true,
      duration: 4000,
      message: 'ui.permit.admin.toast',
      showCloseButton: true,
    });
    toast.onWillDismiss((_data, role) => {
      if (role === 'close') {
        (this.permit as AdminPermit).ctrl -= 1;
      } else {
        this.adminProvider.checkLog('' + this.permit.code);
      }
    });
  }
}
