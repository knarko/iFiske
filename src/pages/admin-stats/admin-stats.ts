import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { serverLocation } from '../../providers/api/serverLocation';
import { AdminProvider } from '../../providers/admin/admin';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-admin-stats',
  templateUrl: 'admin-stats.html',
})
export class AdminStatsPage {
  stats: Observable<any>;
  serverLocation = serverLocation;

  constructor(
    private adminProvider: AdminProvider,
  ) {
    this.stats = this.adminProvider.stats();
    console.log(this.stats);
  }
}
