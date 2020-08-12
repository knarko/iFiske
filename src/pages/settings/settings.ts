import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
} from 'ionic-angular';
import { UpdateProvider } from '../../providers/update/update';
import { SettingsProvider } from '../../providers/settings/settings';
import { UserProvider } from '../../providers/user/user';
import { Observable } from 'rxjs/Observable';
import { LANGUAGES } from '../../app/translation-loader';
import { RegionProvider } from '../../providers/region/region';
import { first } from 'rxjs/operators';

interface SettingsItem {
  title: string;
  note?: string;
  isHeader?: boolean;
  page?: string;
  click?: () => void;
  toggle?: (state: boolean) => void;
  toggleState?: boolean;
  toggleColor?: string;
  show?: Observable<boolean>;
}

@IonicPage({
  defaultHistory: ['HomePage'],
})
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  items: SettingsItem[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private updateProvider: UpdateProvider,
    private modalCtrl: ModalController,
    private settingsProvider: SettingsProvider,
    private userProvider: UserProvider,
    private region: RegionProvider,
  ) {
    const self = this;
    this.items = [
      { title: 'Settings', isHeader: true },
      {
        title: 'Push notifications',
        toggle: (state: boolean) => {
          this.settingsProvider.push = state;
        },
        toggleState: this.settingsProvider.push,
        toggleColor: 'secondary',
      },
      {
        title: 'Analytics',
        toggle: (state: boolean) =>
          (this.settingsProvider.analyticsEnabled = state),
        toggleState: !!this.settingsProvider.analyticsEnabled,
        toggleColor: 'secondary',
      },
      {
        title: 'Update stored data',
        click: () => this.updateProvider.update(true),
      },
      {
        title: 'ui.settings.change_region',
        get note() {
          return 'ui.settings.regions.' + self.region.currentRegion$.value;
        },
        click: async () => {
          const isLoggedIn = await this.userProvider.loggedIn
            .pipe(first())
            .toPromise();
          this.region.selectRegion(isLoggedIn);
        },
      },
      {
        title: 'Change language',
        get note() {
          return LANGUAGES[settingsProvider.language].long;
        },
        click: () => this.modalCtrl.create('ChangeLanguagePage').present(),
      },
      {
        title: 'Log out',
        click: () => this.logout(),
        show: this.userProvider.loggedIn,
      },
      { title: 'Information', isHeader: true },
      { title: 'Contact', page: 'ContactPage' },
      { title: 'Report issue', page: 'ReportIssuePage' },
      { title: 'Terms of service', page: 'TermsPage' },
      { title: 'About the app', page: 'AboutPage' },
    ];
  }

  toggleItem(item: SettingsItem, shouldToggle = false) {
    if (shouldToggle) {
      item.toggleState = !item.toggleState;
    }
    item.toggle(item.toggleState);
  }

  logout = () => {
    this.userProvider.logout().then(() => {
      this.navCtrl.pop();
    });
  };
}
