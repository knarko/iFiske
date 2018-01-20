import { Injectable } from '@angular/core';
import { OrganizationProvider } from '../organization/organization';
import { ApiProvider } from '../api/api';
import { ProductProvider } from '../product/product';
import { UserProvider, Permit } from '../user/user';
import { DBMethod } from '../database/decorators';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

interface AdminOrganization {
  products?: any[];
}

@Injectable()
export class AdminProvider {
  ready: Promise<void>;
  organizations = new Map<number, AdminOrganization>();

  isAdmin: Observable<boolean>;

  constructor(
    private orgProvider: OrganizationProvider,
    private API: ApiProvider,
    private productProvider: ProductProvider,
    private userProvider: UserProvider,
  ) {
    this.ready = Promise.resolve();
    this.isAdmin = this.userProvider.loggedIn.pipe(
      switchMap(loggedIn => {
        if (!loggedIn) {
          return of(loggedIn);
        }
        return fromPromise(this.API.user_organizations()).pipe(
          map(orgs => !!Object.keys(orgs).length),
        );
      }),
    )
  }

  async getPermit(code: string) {
    const permit: Permit = await this.API.adm_check_prod(code);
    permit.validity = this.productProvider.getValidity(permit);
    return permit;
  }

  revokePermit(product, revoke = true) {
    return this.API.adm_revoke_prod(product.code, revoke ? 1 : 0);
  }

  stats(id) {
    return this.API.adm_get_stats(id);
  }

  initOrg(org) {
    this.orgProvider.getOne(org.orgid).then((o) => {
      org.info = o;
    });
    return this.API.adm_products(org.orgid).then((products) => {
      const prods = [];
      for (const product of products) {
        product.validity = this.productProvider.getValidity(product);
        prods.push(product);
      }
      org.products = prods;
    });
  }

  @DBMethod
  getProduct(productID) {
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

  @DBMethod
  getOrganization(orgID: number) {
    return this.organizations.get(orgID);
  }

  async getOrganizations() {
    if (await !this.userProvider.loggedIn.toPromise()) {
      return Promise.reject('Not logged in')
    }

    const orgs = await this.API.user_organizations();
    const p = [];
    for (let id in orgs) {
      const orgId = Number(id);
      const org = this.organizations.get(orgId) || {};
      Object.assign(org, orgs[id]);
      p.push(this.initOrg(org));
      this.organizations.set(orgId, org);
    }
    return Promise.all(p).then(() => orgs);
  }

  @DBMethod
  getProducts(orgID) {
    return this.organizations.get(orgID).products;
  }
}
