import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { serverLocation } from '../../providers/api/serverLocation';

@IonicPage()
@Component({
  selector: 'page-admin-stats',
  templateUrl: 'admin-stats.html',
})
export class AdminStatsPage {
  serverLocation = serverLocation;
}
