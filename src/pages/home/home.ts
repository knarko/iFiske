import { Component } from '@angular/core';
import { NavController, IonicPage, PopoverController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { UserProvider } from '../../providers/user/user';
import { map, take } from 'rxjs/operators';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';

interface Link {
  title: string;
  icon: string;
  uri?: string;
  show?: Observable<boolean>
}

@IonicPage({
  priority: 'high',
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  profileColor: Observable<string>;
  showAdmin: Observable<boolean>;

  links: Link[] = [
    {title: 'Admin Tools', icon: 'unlock', show: this.showAdmin},
    {title: 'Fishing Areas', icon: 'ifiske-fishing', uri: 'AreasPage'},
    {title: 'Map', icon: 'map', uri: 'MapPage'},
    {title: 'My Fishing Permits', icon: 'ifiske-license'},
    {title: 'Information', icon: 'information-circle', uri: 'InformationPage'},
    {title: 'Species', icon: 'ifiske-fish', uri: 'SpeciesPage'},
    {title: 'Fishing Methods', icon: 'ifiske-hook', uri: 'FishingMethodsPage'},
  ];

  constructor(private userProvider: UserProvider, private navCtrl: NavController, private modalCtrl: ModalController) {
    // TODO: not all logged in  users are admins
    this.showAdmin = this.userProvider.loggedIn;
  }

  async gotoProfile() {
    const loggedIn = await this.userProvider.loggedIn.pipe(take(1)).toPromise();
    if (loggedIn) {
      this.modalCtrl.create('ProfilePage').present();
    } else {
      this.modalCtrl.create('LoginPage').present();
    }
  }
}


