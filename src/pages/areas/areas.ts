import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

export interface TabItem {
  title?: string;
  titleFn?: () => string;
  icon: string;
  page: string;
  hide?: boolean;
}

@IonicPage({
  defaultHistory: ['HomePage'],
})
@Component({
  selector: 'page-areas',
  templateUrl: 'areas.html',
})
export class AreasPage {
  tabs: TabItem[] = [
    { page: 'AreasCountiesPage', icon: 'ifiske-fishing', title: 'Counties' },
    { page: 'AreasFavoritesPage', icon: 'star', title: 'Favorites' },
  ];
  selectedTab: TabItem = this.tabs[0];

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  tabSelect(ev: any) {
    this.selectedTab = this.tabs[ev.index];
  }
}
