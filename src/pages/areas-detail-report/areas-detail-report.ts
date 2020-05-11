import { Component, ViewChild, OnDestroy } from '@angular/core';
import {
  IonicPage,
  NavParams,
  NavController,
  Tabs,
  Content,
  Refresher,
} from 'ionic-angular';
import { ReportsProvider, Report } from '../../providers/reports/reports';
import { Observable } from 'rxjs/Observable';
import { Area } from '../../providers/area/area';
import { AreaDetailParams } from '../areas-detail/areas-detail-params';
import { Organization } from '../../providers/organization/organization';
import { take, switchMap, share, takeUntil } from 'rxjs/operators';
import { MonitoringClient } from '../../app/monitoring';
import { Subject } from 'rxjs/Subject';

@IonicPage()
@Component({
  selector: 'page-areas-detail-report',
  templateUrl: 'areas-detail-report.html',
})
export class AreasDetailReportPage implements OnDestroy {
  private navCtrl: NavController;
  private tabsCtrl: Tabs;
  area: Area;
  org: Organization;

  private reports$: Observable<Report[]>;
  reports?: Report[];

  @ViewChild(Content)
  contentRef: Content;

  private fetchReports$ = new Subject<Area>();
  private destroyed$ = new Subject<void>();

  isLoading = true;
  constructor(
    private reportsProvider: ReportsProvider,
    private _navCtrl: NavController,
    private navParams: NavParams,
  ) {
    this.reports$ = this.fetchReports$.pipe(
      switchMap((area) =>
        this.reportsProvider.getReports({ orgId: area.orgid }),
      ),
      share(),
    );

    this.reports$.pipe(takeUntil(this.destroyed$)).subscribe((reports) => {
      this.isLoading = false;
      this.reports = reports;
    });

    const params: Observable<AreaDetailParams> =
      this.navParams.get('params') ||
      ((this._navCtrl as any).rootParams &&
        (this._navCtrl as any).rootParams.params);

    params.subscribe(({ area, org, tabsCtrl, rootNavCtrl }) => {
      if (this.area !== area && area) {
        this.fetchReports$.next(area);
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

  ngOnDestroy() {
    this.destroyed$.next();
  }

  async refresh(refresher: Refresher) {
    try {
      this.fetchReports$.next(this.area);
      await this.reports$.pipe(take(1)).toPromise();
    } catch (error) {
      MonitoringClient.captureException(error);
    } finally {
      refresher.complete();
    }
  }
}
