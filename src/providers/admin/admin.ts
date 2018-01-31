import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { switchMap } from 'rxjs/operators';
import { Pro } from '@ionic/pro';

import * as Fuse from 'fuse.js';
import { FuseOptions } from 'fuse.js';

import { OrganizationProvider, Organization } from '../organization/organization';
import { ApiProvider } from '../api/api';
import { ProductProvider } from '../product/product';
import { UserProvider, Permit } from '../user/user';
import { TranslateActionSheetController } from '../translate-action-sheet-controller/translate-action-sheet-controller';
import { Dictionary } from '../../types';

export interface AdminOrganization {
  at?: number;
  ot?: string;
  orgid?: number;
  level?: number;
  products?: any[];
  info?: Organization;
}

export interface AdminPermit {
  ID: number;
  at: number;
  code: number;
  fr: number;
  fullname: string;
  pdf: string;
  ref1: number;
  ref2: number;
  rev: number;
  suborgid: number;
  subt: string;
  t: string;
  tel: string;
  to: number;

  validity?: string;
}

@Injectable()
export class AdminProvider {
  static readonly private CURRENT_ORGANIZATION = 'ADMIN_CURRENT_ORGANIZATION';
  ready: Promise<void>;
  organizations = new Map<number, AdminOrganization>();
  private permits = new Map<string, ReplaySubject<AdminPermit>>();

  isAdmin: Observable<boolean>;

  currentOrganization = new ReplaySubject<AdminOrganization | undefined>(1);

  numberOfOrganizations = () => {
    return this.organizations.size;
  }

  private _orgId: number;

  get orgId() {
    return this._orgId;
  }

  set orgId(orgId: number) {
    if (this.organizations.has(orgId)) {
      this._orgId = orgId;
      this.currentOrganization.next(this.organizations.get(orgId));
      localStorage.setItem(AdminProvider.CURRENT_ORGANIZATION, orgId);
    } else {
      this._orgId = undefined;
      this.currentOrganization.next(undefined);
    }
  }

  constructor(
    private orgProvider: OrganizationProvider,
    private API: ApiProvider,
    private productProvider: ProductProvider,
    private userProvider: UserProvider,
    private actionSheetCtrl: TranslateActionSheetController,
  ) {
    this.ready = Promise.resolve();
    this.isAdmin = this.userProvider.loggedIn.pipe(
      switchMap(loggedIn => {
        if (!loggedIn) {
          return of(false);
        }
        return fromPromise(this.API.user_organizations().then(orgs => {
          return !!Object.keys(orgs).length
        }, err => {
          console.log(err);
          return false
        }));
      }),
    );
    this.isAdmin.subscribe((admin) => {
      if (admin) {
        this.getOrganizations().then(() => {
          this.setDefaultOrgId();
        });
      } else {
        this.organizations = new Map();
        this.permits = new Map();
        this.orgId = undefined;
      }
    });
  }

  pickOrganization = async () => {
    const buttons = [];
    for (const org of this.organizations.values()) {
      buttons.push({
        text: org.ot,
        handler: () => this.orgId = org.orgid,
        cssClass: this.orgId === org.orgid ? 'current' : undefined,
      });
    }

    buttons.push({
      text: 'Cancel',
      role: 'cancel',
    });

    this.actionSheetCtrl.show({
      title: 'ui.admin.selectOrg',
      cssClass: 'admin-pick-organization',
      buttons,
    });
  }

  getPermit(code: string): Observable<AdminPermit> {
    let subject: ReplaySubject<AdminPermit>;
    if (this.permits.has(code)) {
      subject = this.permits.get(code);
    } else {
      subject = new ReplaySubject<AdminPermit>(1);
      this.permits.set(code, subject);
    }
    this.getPermitApi(code).then(permit => {
      subject.next(permit);
    }, err => {
      subject.error(err);
    });

    return subject.asObservable();
  }

  getPermitApi(code) {
    return this.API.adm_check_prod(code).then(permit => {
      permit.validity = this.productProvider.getValidity(permit);
      return permit;
    });
  }

  private setDefaultOrgId() {
    if (this.organizations.size) {
      const orgId = Number(localStorage.getItem(AdminProvider.CURRENT_ORGANIZATION));
      if (this.organizations.has(orgId)) {
        this.orgId = orgId;
      } else {
        this.orgId = this.organizations.keys().next().value;
      }
    }
  }

  revokePermit(product, revoke = true) {
    return this.API.adm_revoke_prod(product.code, revoke ? 1 : 0);
  }

  stats() {
    return this.API.adm_get_stats(this.orgId);
  }

  private async initOrg(org: AdminOrganization) {
    return Promise.all([
      this.API.adm_products(org.orgid).then((products: Dictionary<Permit>) => {
        const prods = [];
        for (const product of Object.values(products)) {
          product.validity = this.productProvider.getValidity(product);
          prods.push(product);
        }
        org.products = prods;
      }),
      this.orgProvider.getOne(org.orgid).then((o) => {
        org.info = o;
      }, err => {
        Pro.getApp().monitoring.exception(new Error('Could not find an organisation that matches ' + JSON.stringify(org)));
      }),
    ]);
  }

  async getProduct(productID) {
    let product;
    try {
      for (const org of this.organizations.values()) {
          product = org.products.find(p => Number(p.ID) === Number(productID))
          if (product) {
            break;
          }
        }
    } catch (e) {
    }
    if (product) {
      return product;
    }
    return Promise.reject('License with this code not found');
  }

  getOrganization(orgID: number) {
    return this.organizations.get(orgID);
  }

  async getOrganizations() {
    if (await !this.userProvider.loggedIn.toPromise()) {
      return Promise.reject('Not logged in')
    }

    try {
      const orgs = await this.API.user_organizations();
      const p = [];
      for (let id in orgs) {
        const orgId = Number(id);
        const org: AdminOrganization = this.organizations.get(orgId) || {};
        Object.assign(org, orgs[id]);
        p.push(this.initOrg(org));
        this.organizations.set(orgId, org);
      }
      return Promise.all(p).then(() => orgs);
    } catch (err) {
      return [];
    }
  }

  search(searchTerm?: string) {
    return this.currentOrganization.pipe(
      switchMap(org => {
        return this.getPermits(searchTerm);
      }),
    );
  }

  async getPermits(searchTerm?: string) {
    if (this.organizations.size < 1) {
      await this.getOrganizations();
    }

    if (!this.organizations.has(this.orgId)) {
      this.setDefaultOrgId();
    }

    if (!this.organizations.has(this.orgId)) {
      return [];
    }

    const permits = this.organizations.get(this.orgId).products;

    if (!searchTerm) {
      return permits;
    }

    const options: FuseOptions = {
      keys: [{
        name: 'tel',
        weight: 0.7,
      }, {
        name: 't',
        weight: 0.6,
      }, {
        name: 'fullname',
        weight: 0.7,
      }],
      threshold: 0.5,
    };

    const fuse = new Fuse(permits, options);

    return fuse.search(searchTerm);
  }
}
