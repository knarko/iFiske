import { Component } from '@angular/core';
import { IonicPage, Platform } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Pro, DeployInfo } from '@ionic-native/pro/ngx';

import { UpdateProvider } from '../../providers/update/update';
import { SettingsProvider } from '../../providers/settings/settings';
import { TranslateAlertController } from '../../providers/translate-alert-controller/translate-alert-controller';
import { TranslateToastController } from '../../providers/translate-toast-controller/translate-toast-controller';
import { TranslateLoadingController } from '../../providers/translate-loading-controller/translate-loading-controller';
import { DeployProvider } from '../../providers/deploy/deploy';
import { APP_VERSION } from '../../app/config';
import { MonitoringClient } from '../../app/monitoring';

@IonicPage({
  defaultHistory: ['HomePage', 'SettingsPage'],
})
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {
  codeVersion: string;
  lastUpdated: string;
  proInfo?: DeployInfo;
  buildId?: string;
  version?: string;

  developerClicked = 0;

  useBetaChannel: boolean = this.settings.channel === 'Master';

  constructor(
    private appVersion: AppVersion,
    private platform: Platform,
    private update: UpdateProvider,
    public settings: SettingsProvider,
    private pro: Pro,
    private alertCtrl: TranslateAlertController,
    private toastCtrl: TranslateToastController,
    private loadingCtrl: TranslateLoadingController,
    private deploy: DeployProvider,
  ) {}

  ionViewWillEnter() {
    this.developerClicked = 0;
    this.codeVersion = APP_VERSION;
    this.lastUpdated = this.update.lastUpdate;
    this.platform.ready().then(() => {
      if ((window as any).cordova) {
        this.appVersion
          .getVersionNumber()
          .then(version => (this.version = version))
          .catch(() => {});
        this.appVersion
          .getVersionCode()
          .then(buildId => (this.buildId = `${buildId}`))
          .catch(() => {});
        console.log(this.pro);
        Promise.race([this.pro.deploy().info(), new Promise<any>((_, reject) => setTimeout(reject, 8000))])
          .then(info => (this.proInfo = info))
          .catch(err => {
            console.warn(err);
            if (err) {
              MonitoringClient.captureException(err);
            }
          });
      } else {
        this.buildId = 'abc123';
        this.version = APP_VERSION;
      }
    });
  }

  async selectDeployChannel() {
    if (!this.settings.isDeveloper) {
      return;
    }
    this.settings.channel = this.useBetaChannel ? 'Master' : 'Production';
    await this.deploy.setChannel(this.settings.channel);
    this.pro
      .deploy()
      .info()
      .then(info => (this.proInfo = info))
      .catch(err => console.warn(err));
  }

  async activateDeveloperMode() {
    if (this.settings.isDeveloper) {
      return;
    }

    if (this.developerClicked > 10) {
      this.settings.isDeveloper = true;
      this.toastCtrl.show({
        message: 'You are now a developer',
        duration: 4000,
      });
    } else {
      this.developerClicked++;
    }
  }

  async checkForUpdates() {
    const loading = await this.loadingCtrl.show({ content: 'Checking for updates' });
    try {
      const updated = await this.deploy.checkForUpdates();
      if (updated) {
        this.alertCtrl.show({
          message: 'Updated!',
          buttons: [
            {
              text: 'OK',
            },
          ],
        });
      } else {
        this.alertCtrl.show({
          message: 'No updates available',
          buttons: [
            {
              text: 'OK',
            },
          ],
        });
      }
    } catch (e) {
      console.error(e);
      this.alertCtrl.show({
        message: 'No updates available',
        buttons: [
          {
            text: 'OK',
          },
        ],
      });
    } finally {
      loading.dismiss();
    }
  }
}
