import { Component } from '@angular/core';
import { IonicPage, Platform } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';
import { UpdateProvider } from '../../providers/update/update';
import { SettingsProvider } from '../../providers/settings/settings';
import { Pro, DeployInfo } from '@ionic-native/pro';
import { TranslateAlertController } from '../../providers/translate-alert-controller/translate-alert-controller';
import { TranslateToastController } from '../../providers/translate-toast-controller/translate-toast-controller';

@IonicPage({
  defaultHistory: ['HomePage', 'SettingsPage'],
})
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {
  lastUpdated: string;
  proInfo?: DeployInfo;
  buildId?: string;
  version?: string;

  developerClicked = 0;

  constructor(
    private appVersion: AppVersion,
    private platform: Platform,
    private update: UpdateProvider,
    public settings: SettingsProvider,
    private pro: Pro,
    private alertCtrl: TranslateAlertController,
    private toastCtrl: TranslateToastController,
  ) { }

  ionViewWillEnter() {
    this.lastUpdated = this.update.lastUpdate;
    this.platform.ready().then(() => {
      if ((window as any).cordova) {
        this.appVersion.getVersionNumber()
          .then(version => this.version = version)
          .catch(() => { });
        this.appVersion.getVersionCode()
          .then(buildId => this.buildId = buildId)
          .catch(() => { });
        this.pro.deploy.info()
          .then(info => this.proInfo = info)
          .catch(err => console.warn(err));
      } else {
        this.buildId = 'abc123';
        this.version = '4.0.0';
      }
    });
  }

  async activateDeveloperMode() {
    if (this.settings.isDeveloper) {
      const alert = await this.alertCtrl.show({
        title: 'Select Build Channel',
        buttons: [
          {
            text: 'Master',
            role: 'Master',
          },
          {
            text: 'Developer',
            role: 'Developer',
          },
        ],
      });
      alert.onDidDismiss(async (_data, role) => {
        if (role === 'Developer' || role === 'Master') {
          await this.pro.deploy.init({
            channel: role,
          });
        }
        this.pro.deploy.info()
          .then(info => this.proInfo = info)
          .catch(err => console.warn(err));
      });
    } else if (this.developerClicked > 10) {
      this.settings.isDeveloper = true;
      this.toastCtrl.show({
        message: 'You are now a developer',
      });
    } else {
      this.developerClicked++;
    }
  }

  async checkForUpdates() {
    if (await this.pro.deploy.check()) {
      await this.pro.deploy.download().toPromise();
      await this.pro.deploy.extract().toPromise();
      await this.pro.deploy.redirect();
    }
  }
}
