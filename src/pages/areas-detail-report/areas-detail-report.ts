import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavParams, NavController, Tabs, Content } from 'ionic-angular';
import { ReportsProvider, Report, Catch } from '../../providers/reports/reports';
import { Observable } from 'rxjs/Observable';
import { Area } from '../../providers/area/area';
import { AreaDetailParams } from '../areas-detail/areas-detail-params';
import { Organization } from '../../providers/organization/organization';

@IonicPage()
@Component({
  selector: 'page-areas-detail-report',
  templateUrl: 'areas-detail-report.html',
})
export class AreasDetailReportPage {
  private navCtrl: NavController;
  private tabsCtrl: Tabs;
  area: Area;
  org: Organization;

  reports$: Observable<Report[]>;

  @ViewChild(Content)
  contentRef: Content;

  constructor(private reportsProvider: ReportsProvider, private _navCtrl: NavController, private navParams: NavParams) {
    const params: Observable<AreaDetailParams> =
      this.navParams.get('params') || ((this._navCtrl as any).rootParams && (this._navCtrl as any).rootParams.params);
    params.subscribe(({ area, org, tabsCtrl, rootNavCtrl }) => {
      if (this.area !== area && area) {
        this.reports$ = this.reportsProvider.getReports({ orgId: area.orgid });
        this.reports$.subscribe(
          res => {
            console.log(res);
          },
          err => {
            console.error(err);
          },
        );
      }
      this.navCtrl = rootNavCtrl;
      this.tabsCtrl = tabsCtrl;
      this.org = org;
      this.area = area;
      if (this.contentRef) {
        this.contentRef.resize();
      }
    });
  }

  openTechnique(report: Report) {
    this.navCtrl.push('FishingMethodsDetailPage', { ID: report.tech });
  }
  openFish(catched: Catch) {
    this.navCtrl.push('SpeciesDetailPage', { ID: catched.type });
  }
}
