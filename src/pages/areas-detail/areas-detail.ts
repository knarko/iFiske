import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Tabs } from 'ionic-angular';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { TabItem } from '../areas/areas';
import { Area, AreaProvider } from '../../providers/area/area';
import {
  OrganizationProvider,
  Organization,
} from '../../providers/organization/organization';
import { ProductProvider, Product } from '../../providers/product/product';
import { Fish } from '../../providers/fish/fish';
import { AreaDetailParams } from './areas-detail-params';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';

@IonicPage({
  segment: 'area-detail/:ID',
  defaultHistory: ['HomePage', 'AreasPage', 'AreasSearchPage'],
})
@Component({
  selector: 'page-areas-detail',
  templateUrl: 'areas-detail.html',
})
export class AreasDetailPage {
  species: Fish[];
  products: Product[];
  org: Organization;
  area: Area;
  tabParams = new ReplaySubject<AreaDetailParams>(1);
  @ViewChild(Tabs)
  tabsCtrl: Tabs;

  private baseTabs = {
    information: {
      page: 'AreasDetailInfoPage',
      title: 'Information',
      icon: 'information-circle',
    },
    reports: {
      page: 'AreasDetailReportPage',
      title: 'Reports',
      icon: 'ifiske-hook',
    },
    permits: {
      page: 'AreasDetailPermitPage',
      title: 'Permits',
      icon: 'ifiske-permit',
    },
    map: { page: 'AreasDetailMapPage', title: 'Map', icon: 'map' },
  };

  tabs?: TabItem[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private areaProvider: AreaProvider,
    private organizationProvider: OrganizationProvider,
    private productProvider: ProductProvider,
    private analytics: FirebaseAnalytics,
  ) {
    this.areaProvider.getOne(this.navParams.get('ID')).then((area) => {
      this.area = area;
      console.log(area);
      this.updateParams();
      this.getOrg();
      this.analytics.logEvent('select_content', {
        content_type: 'Area',
        item_id: area.ID,
      });
    });

    this.productProvider
      .getByArea(this.navParams.get('ID'))
      .then((products) => {
        this.products = products;
        this.updateParams();
      })
      .catch((e) => console.warn(e));

    this.areaProvider
      .getFishes(this.navParams.get('ID'))
      .then((species) => {
        this.species = species;
        this.updateParams();
      })
      .catch((e) => console.warn(e));
  }

  ngAfterViewInit() {
    this.updateParams();
  }

  private getOrg() {
    this.organizationProvider.getOne(this.area.orgid).then((org) => {
      this.org = org;
      this.updateParams();
      if (this.org.crp === 2) {
        this.tabs = [
          this.baseTabs.information,
          this.baseTabs.permits,
          this.baseTabs.map,
        ];
      } else {
        this.tabs = [
          this.baseTabs.information,
          this.baseTabs.reports,
          this.baseTabs.permits,
          this.baseTabs.map,
        ];
      }
      // Need to update the params after angular has rendered again so that the tabController is set
      setTimeout(() => this.updateParams());
    });
  }

  private updateParams() {
    this.tabParams.next({
      area: this.area,
      org: this.org,
      products: this.products,
      tabsCtrl: this.tabsCtrl,
      rootNavCtrl: this.navCtrl,
      species: this.species,
    });
  }
}
