import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { switchMap } from 'rxjs/operators';

import * as Fuse from 'fuse.js';
import { FuseOptions } from 'fuse.js';

import { OrganizationProvider, Organization } from '../organization/organization';
import { ApiProvider } from '../api/api';
import { ProductProvider } from '../product/product';
import { UserProvider, Permit } from '../user/user';
import { TranslateActionSheetController } from '../translate-action-sheet-controller/translate-action-sheet-controller';
import { Dictionary } from '../../types';

export interface AdminOrganization {
  products?: any[];
  info?: Organization;
  orgid?: number;
}

@Injectable()
export class AdminProvider {
  ready: Promise<void>;
  organizations = new Map<number, AdminOrganization>();
  private permits = new Map<string, ReplaySubject<Permit>>();

  isAdmin: Observable<boolean>;

  currentOrganization = new ReplaySubject<AdminOrganization | undefined>(1);

  private _orgId: number;

  get orgId() {
    return this._orgId;
  }

  set orgId(orgId: number) {
    if (this.organizations.has(orgId)) {
    this._orgId = orgId;
    this.currentOrganization.next(this.organizations.get(orgId));
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

  pickOrganization() {
    const buttons = [];
    for (const org of this.organizations.values()) {
      buttons.push({
        text: org.info.t,
        handler: () => this.orgId = org.orgid,
        cssClass: this.orgId === org.orgid ? 'current' : undefined,
      });
    }

    buttons.push({
      text: 'Cancel',
      role: 'cancel',
    });

    this.actionSheetCtrl.show({
      title: 'Select Organization',
      cssClass: 'admin-pick-organization',
      buttons,
    });
  }

  getPermit(code: string): Observable<Permit> {
    let subject: ReplaySubject<Permit>;
    if (this.permits.has(code)) {
      subject = this.permits.get(code);
    } else {
      subject = new ReplaySubject<Permit>(1);
      this.permits.set(code, subject);
    }
    this.getPermitApi(code).then(([err, permit]) => {
      if (err) {
        subject.error(err);
      } else {
        subject.next(permit);
      }
    }).catch(err => {
      subject.error(err);
    });

    return subject.asObservable();
  }

  async getPermitApi(code) {
    // For some reason I have to use a weird promise thatn cannot be rejected, since it complains about an uncaught error (even if the error is caught....)
    try {
      const permit = await this.API.adm_check_prod(code)
      permit.validity = this.productProvider.getValidity(permit);
      return [undefined, permit];
    } catch (err) {
      return [err, undefined];
    }
  }

  private setDefaultOrgId() {
    if (this.organizations.size)
    this.orgId = this.organizations.keys().next().value;
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
