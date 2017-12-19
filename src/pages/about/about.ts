import { Component } from '@angular/core';
import { IonicPage, Platform } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';
import { UpdateProvider } from '../../providers/update/update';
import { SettingsProvider } from '../../providers/settings/settings';

declare var IonicCordova: any;

@IonicPage({
  defaultHistory: ['HomePage', 'SettingsPage'],
})
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {
  channel?: string;
  deployVersion?: string;
  lastUpdated: string;
  buildId?: string;
  version?: string;

  developerClicked = 0;

  constructor(
    private appVersion: AppVersion,
    private platform: Platform,
    private update: UpdateProvider,
    private settings: SettingsProvider,
  ) { }

  ionViewWillEnter() {
    this.lastUpdated = this.update.lastUpdate;
    this.platform.ready().then(() => {
      if ((window as any).cordova) {
        this.appVersion.getVersionNumber()
          .then(version => this.version = version)
          .catch(() => {});
        this.appVersion.getVersionCode()
          .then(buildId => this.buildId = buildId)
          .catch(() => {});
          try {
            IonicCordova.deploy.info(info => {
              this.deployVersion = info.deploy_uuid;
              this.channel = info.channel;
            }, err => {
              console.warn(err);
            });
          } catch (err) {
            console.warn(err);
          }
      } else {
        this.buildId = 'abc123';
        this.version = '4.0.0';
      }
    });
  }

  activateDeveloperMode() {
    /** TODO: add developermode
    if (this.developerClicked > 10) {
      this.settings.isDeveloper = true;
    }
    if (this.settings.isDeveloper) {
      try {
        IonicCordova.deploy.init({
          channel: 'Developer',
        });
      }
    }
    */
  }
}
