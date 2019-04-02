import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { UserProvider } from '../../providers/user/user';
import { take } from 'rxjs/operators';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { AdminProvider } from '../../providers/admin/admin';
import { SettingsProvider } from '../../providers/settings/settings';
import { TranslateAlertController } from '../../providers/translate-alert-controller/translate-alert-controller';

interface Link {
  title: string;
  icon: string;
  uri?: string;
  action?: () => void;
  show?: Observable<boolean>;
}

@IonicPage({
  priority: 'high',
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  searchTerm: string;
  profileColor: Observable<string>;
  showAdmin = this.adminProvider.isAdmin;

  links: Link[] = [
    { title: 'Control panel', icon: 'unlock', uri: 'AdminPage', show: this.showAdmin },
    { title: 'Fishing Areas', icon: 'ifiske-fishing', uri: 'AreasPage' },
    { title: 'Map', icon: 'map', uri: 'MapPage' },
    {
      title: 'My Fishing Permits',
      icon: 'ifiske-permit',
      action: async () => {
        if (await this.userProvider.loggedIn.pipe(take(1)).toPromise()) {
          this.navCtrl.push('MyPermitsPage');
        } else {
          this.modalCtrl.create('LoginPage').present();
        }
      },
    },
    { title: 'Information', icon: 'information-circle', uri: 'InformationPage' },
  ];

  constructor(
    private userProvider: UserProvider,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private adminProvider: AdminProvider,
    private settings: SettingsProvider,
  ) {}

  async ionViewDidEnter() {
    if (this.settings.analyticsEnabled === undefined) {
      const modal = this.modalCtrl.create('AnalyticsConsentPage', undefined, {
        cssClass: 'floating-modal',
        showBackdrop: true,
      });
      await modal.present();
      modal.onWillDismiss((action: string) => {
        if (action === 'decline') {
          this.settings.analyticsEnabled = false;
        } else if (action === 'accept') {
          this.settings.analyticsEnabled = true;
        }
      });
    }
  }

  async gotoProfile() {
    const loggedIn = await this.userProvider.loggedIn.pipe(take(1)).toPromise();
    if (loggedIn) {
      this.modalCtrl.create('ProfilePage').present();
    } else {
      this.modalCtrl.create('LoginPage').present();
    }
  }

  search() {
    this.navCtrl.push('AreasSearchPage', { searchTerm: this.searchTerm });
  }
}
