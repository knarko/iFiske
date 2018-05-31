import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { switchMap, filter, map } from 'rxjs/operators';

import * as Fuse from 'fuse.js';
import { FuseOptions } from 'fuse.js';

import { ApiProvider } from '../api/api';
import { UserProvider } from '../user/user';
import { TranslateActionSheetController } from '../translate-action-sheet-controller/translate-action-sheet-controller';
import { Dictionary } from '../../types';
import { BaseModel } from '../database/basemodel';
import { TableDef } from '../database/table';
import { DatabaseProvider } from '../database/database';
import { DBMethod } from '../database/decorators';
import { catchError } from 'rxjs/operators/catchError';
import { SessionProvider } from '../session/session';
import { getPermitValidity } from '../../util';

export interface AdminOrganization {
  ID: number;
  at: number;
  ot: string;
  level: number;
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
export class AdminProvider extends BaseModel {
  private static readonly LAST_UPDATED = 'ADMIN_LAST_UPDATED';
  private static readonly CURRENT_ORGANIZATION = 'ADMIN_CURRENT_ORGANIZATION';

  protected readonly tables: Dictionary<TableDef> = {
    organizations: {
      name: 'Admin_Organizations',
      members: {
        ID: 'int',
        at: 'int',
        ot: 'text',
        level: 'int',
      },
      primary: 'ID',
    },
    permits: {
      name: 'Admin_Permits',
      members: {
        ID: 'int',
        org: 'int',
        at: 'int',
        code: 'int',
        fr: 'int',
        fullname: 'text',
        pdf: 'text',
        ref1: 'int',
        ref2: 'int',
        rev: 'int',
        subt: 'text',
        t: 'text',
        tel: 'text',
        to: 'int',
      },
      primary: 'ID',
    },
  };

  ready: Promise<boolean>;

  isAdmin: Observable<boolean>;

  private permits = new Map<string, ReplaySubject<AdminPermit>>();

  currentOrganization = new ReplaySubject<AdminOrganization | undefined>(1);

  numberOfOrganizations: number;

  private _orgId: number;

  lastUpdated?: number = JSON.parse(localStorage.getItem(AdminProvider.LAST_UPDATED));

  get orgId() {
    return this._orgId;
  }

  set orgId(orgId: number) {
    this._orgId = orgId;
    if (orgId == undefined) {
      return;
    }
    this.getOrganization(orgId).then(
      org => {
        this.currentOrganization.next(org);
        localStorage.setItem(AdminProvider.CURRENT_ORGANIZATION, '' + orgId);
      },
      err => {
        this._orgId = undefined;
        this.currentOrganization.next(undefined);
      },
    );
  }


  constructor(
    protected API: ApiProvider,
    protected DB: DatabaseProvider,
    private userProvider: UserProvider,
    private actionSheetCtrl: TranslateActionSheetController,
    private session: SessionProvider,
  ) {
    super();
    this.initialize();

    this.isAdmin = this.userProvider.loggedIn.pipe(
      switchMap(loggedIn => {
        if (!loggedIn) {
          return of(false);
        }
        return this.currentOrganization.pipe(map(org => !!org));
      }),
    );

    this.userProvider.loggedIn.subscribe(loggedIn => this.update(true));

    this.isAdmin.subscribe(admin => {
      if (!admin) {
        this.orgId = undefined;
      } else {
        this.getOrganizations().then(orgs => {
          this.numberOfOrganizations = orgs.length;
        });
      }
    });
  }

  setLastUpdated() {
    this.lastUpdated = Date.now();
    localStorage.setItem(AdminProvider.LAST_UPDATED, JSON.stringify(this.lastUpdated));
  }

  async update(skipWait?: boolean): Promise<boolean> {
    if (!this.session.token) {
      return false;
    }

    if (!skipWait) {
      await this.ready;
    }

    try {
      let deletePermits = true;
      const orgs: Dictionary<AdminOrganization> = await this.API.user_organizations();
      const organizations = Object.values(orgs);
      organizations.forEach(org => (org.ID = (org as any).orgid));

      await this.DB.populateTable(this.tables.organizations, orgs);

      const orgPermits = await Promise.all(organizations.map(async org => this.API.adm_products(org.ID)));

      await organizations.map((org, i) => {
        const permits = orgPermits[i];
        Object.values(permits).forEach((permit: any) => (permit.org = org.ID));
        const populated = this.DB.populateTable(this.tables.permits, permits, deletePermits);
        deletePermits = false;
        return populated;
      });
      this.setDefaultOrgId();
      this.setLastUpdated();
      return true;
    } catch (err) {
      console.warn(err);
      return false;
    } finally {
      this.setDefaultOrgId();
    }
  }

  pickOrganization = async () => {
    const buttons = [];
    const organizations = await this.getOrganizations();
    for (const org of organizations) {
      buttons.push({
        text: org.ot,
        handler: () => (this.orgId = org.ID),
        cssClass: this.orgId === org.ID ? 'current' : undefined,
      });
    }

    buttons.push({
      text: 'Cancel',
      role: 'cancel',
    });

    this.actionSheetCtrl.show(
      {
        title: 'ui.admin.selectOrg',
        cssClass: 'admin-pick-organization',
        buttons,
      },
      { buttons: false },
    );
  };

  private async setDefaultOrgId() {
    const organizations = await this.getOrganizations();
    if (organizations.length) {
      const orgId = Number(localStorage.getItem(AdminProvider.CURRENT_ORGANIZATION));
      if (organizations.find(org => org.ID === orgId)) {
        this.orgId = orgId;
      } else {
        this.orgId = organizations[0].ID;
      }
    }
  }

  stats() {
    return this.currentOrganization.pipe(
      filter(org => !!org),
      switchMap(org => {
        return this.API.admGetStats(org.ID).pipe(map(stats => stats[org.ID]), catchError(() => of(undefined)));
      }),
    );
  }

  @DBMethod
  async getOrganization(orgID: number) {
    return this.DB.getSingle(`SELECT * FROM Admin_Organizations WHERE ID = ?`, [orgID]);
  }

  @DBMethod
  async getOrganizations(): Promise<AdminOrganization[]> {
    if (await !this.userProvider.loggedIn.toPromise()) {
      return Promise.reject('Not logged in');
    }

    return this.DB.getMultiple(`SELECT * FROM Admin_Organizations`);
  }

  search(searchTerm?: string) {
    return this.currentOrganization.pipe(
      switchMap(org => {
        return this.getPermits(searchTerm);
      }),
    );
  }

  getPermit(code: string): Observable<AdminPermit> {
    let subject: ReplaySubject<AdminPermit>;
    if (this.permits.has(code)) {
      subject = this.permits.get(code);
    } else {
      subject = new ReplaySubject<AdminPermit>(1);
      this.permits.set(code, subject);
    }

    let foundPermit = false;
    const successHandler = permit => {
      foundPermit = true;
      this.transformPermit(permit);
      subject.next(permit);
    };

    const errorHandler = err => {
      if (!foundPermit) {
        subject.error(err);
      } else {
        console.warn(err);
      }
    };

    this.DB.getSingle(
      `
      SELECT * FROM Admin_Permits
      WHERE code = ?
    `,
      [code],
    )
      .then(successHandler)
      .catch(err => {
        console.warn(err);
      });

    this.API.adm_check_prod(code)
      .then(successHandler, errorHandler)
      .catch(err => {});

    return subject.asObservable();
  }

  @DBMethod
  async getPermits(searchTerm?: string): Promise<(AdminPermit & { score?: number })[]> {
    const permits = await this.DB.getMultiple(
      `
      SELECT * FROM Admin_Permits
      WHERE org = ?
      ORDER BY fullname
    `,
      [this.orgId],
    );

    permits.forEach(this.transformPermit);

    if (!searchTerm) {
      return permits;
    }

    const options: FuseOptions = {
      keys: [
        {
          name: 'tel',
          weight: 0.7,
        },
        {
          name: 't',
          weight: 0.6,
        },
        {
          name: 'fullname',
          weight: 0.7,
        },
        {
          name: 'code',
          weight: 0.4,
        },
      ],
      threshold: 0.5,
      shouldSort: false,
      includeScore: true,
    };

    const fuse = new Fuse(permits, options);

    return fuse.search(searchTerm).map(({ item, score }) => {
      return { ...item, score };
    });
  }

  transformPermit = (permit: AdminPermit) => {
    if (!permit) {
      return;
    }
    permit.validity = getPermitValidity(permit);
    return permit;
  };

  async revokePermit(code: string, revoke = true) {
    const res = await this.API.adm_revoke_prod(code, revoke ? 1 : 0);
    await this.update();
    return res;
  }
}
