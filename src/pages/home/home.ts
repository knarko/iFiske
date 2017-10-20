import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';

@IonicPage({
  priority: 'high',
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  links = [
    {title: 'Admin Tools', icon: 'unlock'},
    {title: 'Fishing Areas', icon: 'ifiske-fishing', uri: 'AreasPage'},
    {title: 'Map', icon: 'map', uri: 'MapPage'},
    {title: 'My Fishing Permits', icon: 'ifiske-license'},
    {title: 'Information', icon: 'information-circle', uri: 'InformationPage'},
    {title: 'Species', icon: 'ifiske-fish', uri: 'SpeciesPage'},
    {title: 'Fishing Methods', icon: 'ifiske-hook', uri: 'FishingMethodsPage'},
  ];

  constructor(public navCtrl: NavController) {

  }

  goto(link: string) {
    this.navCtrl.push(link);
  }
}


