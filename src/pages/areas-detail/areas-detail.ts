import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { TabItem } from '../areas/areas';
import { Area, AreaProvider } from '../../providers/area/area';
import { OrganizationProvider, Organization } from '../../providers/organization/organization';
import { ProductProvider, Product } from '../../providers/product/product';
import { SuperTabs } from '@ifiske/ionic2-super-tabs';
import { Fish } from '../../providers/fish/fish';

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
  tabs: TabItem[] = [
    { page: 'AreasDetailInfoPage', title: 'Information', icon: 'information-circle' },
    { page: 'AreasDetailPermitPage', title: 'Fishing Permits', icon: 'ifiske-permit' },
    { page: 'AreasDetailSpeciesPage', title: 'Species', icon: 'ifiske-fish', hide: true },
    { page: 'AreasDetailMapPage', title: 'Map', icon: 'map' },
  ];
  tabParams = new ReplaySubject<any>(1);

  @ViewChild(SuperTabs) superTabsCtrl: SuperTabs;

  @ViewChild(Content) content: Content;


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

    this.areaProvider.getFishes(this.navParams.get('ID'))
      .then(species => {
        this.species = species;
        //this.tabs[2].hide = false;
        this.updateParams();
      }).catch(e => console.warn(e));

  }

  ngAfterViewInit() {
    this.superTabsCtrl.enableTabSwipe(this.tabs[3].page, false);
    this.updateParams();
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
      tabsCtrl: this.superTabsCtrl,
      rootNavCtrl: this.navCtrl,
      species: this.species,
    });
    this.content.resize();
  }


}
