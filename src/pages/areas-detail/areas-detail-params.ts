import { Area } from '../../providers/area/area';
import { Organization } from '../../providers/organization/organization';
import { Product } from '../../providers/product/product';
import { Tabs, NavController } from 'ionic-angular';
import { Fish } from '../../providers/fish/fish';

export interface AreaDetailParams {
  area?: Area;
  org?: Organization;
  products?: Product[];
  tabsCtrl?: Tabs;
  rootNavCtrl?: NavController;
  species?: Fish[];
}
