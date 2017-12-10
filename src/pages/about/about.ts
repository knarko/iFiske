import { Component } from '@angular/core';
import { IonicPage, Platform } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';
import { UpdateProvider } from '../../providers/update/update';

@IonicPage({
  defaultHistory: ['HomePage', 'SettingsPage'],
})
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {
  lastUpdated: string;
  buildId?: string;
  version?: string;

  constructor(
    private appVersion: AppVersion,
    private platform: Platform,
    private update: UpdateProvider,
  ) { }

  ionViewWillLoad() {
    this.lastUpdated = this.update.lastUpdate;
    this.platform.ready().then(() => {
      if ((window as any).cordova) {
        this.appVersion.getVersionNumber()
          .then(version => this.version = version)
          .catch();
        this.appVersion.getVersionCode()
          .then(buildId => this.buildId = buildId)
          .catch();
      } else {
        this.buildId = 'abc123';
        this.version = '4.0.0';
      }
    });
  }
}
