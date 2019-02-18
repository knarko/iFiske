import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { UpdateProvider } from '../../providers/update/update';
import { SettingsProvider } from '../../providers/settings/settings';
import { UserProvider } from '../../providers/user/user';
import { Observable } from 'rxjs';

interface SettingsItem {
  title: string;
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
  items: SettingsItem[] = [
    { title: 'Settings', isHeader: true },
    {
      title: 'Push notifications',
      toggle: (state: boolean) => {
        this.settingsProvider.push = state;
      },
      toggleState: this.settingsProvider.push,
      toggleColor: 'secondary',
    },
    { title: 'Update stored data', click: () => this.updateProvider.update(true) },
    { title: 'Change language', click: () => this.modalCtrl.create('ChangeLanguagePage').present() },
    { title: 'Log out', click: () => this.logout(), show: this.userProvider.loggedIn },
    { title: 'Information', isHeader: true },
    { title: 'Contact', page: 'ContactPage' },
    { title: 'Report issue', page: 'ReportIssuePage' },
    { title: 'Terms of service', page: 'TermsPage' },
    { title: 'About the app', page: 'AboutPage' },
  ];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private updateProvider: UpdateProvider,
    private modalCtrl: ModalController,
    private settingsProvider: SettingsProvider,
    private userProvider: UserProvider,
  ) {}

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
