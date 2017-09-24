import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { TabItem } from '../areas/areas';
import { Area, AreaProvider } from '../../providers/area/area';
import { OrganizationProvider, Organization } from '../../providers/organization/organization';
import { ProductProvider, Product } from '../../providers/product/product';

@IonicPage({
  segment: 'area-detail/:ID',
  defaultHistory: ['HomePage', 'AreasPage', 'AreasSearchPage'],
})
@Component({
  selector: 'page-areas-detail',
  templateUrl: 'areas-detail.html',
})
export class AreasDetailPage {
  products: Product[];
  org: Organization;
  area: Area;
  tabs: TabItem[] = [
    { page: 'AreasDetailInfoPage', title: 'Information', icon: 'information-circle' },
    { page: 'AreasDetailLicensePage', title: 'Fishing Permits', icon: 'ifiske-license' },
    { page: 'AreasDetailMapPage', title: 'Map', icon: 'map' },
  ];
  tabParams = new ReplaySubject<any>(1);

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private areaProvider: AreaProvider,
    private organizationProvider: OrganizationProvider,
    private productProvider: ProductProvider,
  ) {
    this.areaProvider.getOne(this.navParams.get('ID'))
      .then(info => {
        this.area = info
        console.log(info);
        this.updateParams();
        this.getOrg();
      });
      this.productProvider.getByArea(this.navParams.get('ID'))
      .then(products => {
        this.products = products;
        this.updateParams();
      }).catch(e => console.warn(e));
  }

  private getOrg() {
    this.organizationProvider.getOne(this.area.orgid)
      .then(org => {
        this.org = org;
        this.updateParams();
      });
    }

  private updateParams() {
    this.tabParams.next({
      area: this.area,
      org: this.org,
      products: this.products,
    });
  }

}
