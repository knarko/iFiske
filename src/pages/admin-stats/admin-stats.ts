import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { serverLocation } from '../../providers/api/serverLocation';
import { AdminProvider, AdminOrganization } from '../../providers/admin/admin';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-admin-stats',
  templateUrl: 'admin-stats.html',
})
export class AdminStatsPage {
  organization: Observable<AdminOrganization>;
  stats$: Observable<any>;
  serverLocation = serverLocation;

  constructor(
    private adminProvider: AdminProvider,
  ) {
    this.stats$ = this.adminProvider.stats();
    this.stats$.subscribe(console.log, console.warn, console.error);
    this.organization = this.adminProvider.currentOrganization;
  }
}
