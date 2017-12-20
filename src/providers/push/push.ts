import { Injectable } from '@angular/core';
import { NavController, App } from 'ionic-angular';
import { SessionProvider } from '../session/session';
import { SettingsProvider } from '../settings/settings';
import { serverLocation } from '../api/serverLocation';
import { TranslateAlertController } from '../translate-alert-controller/translate-alert-controller';
import { FCM, NotificationData } from '@ionic-native/fcm';
import { Dictionary } from '../../types';
import { setTimeout } from 'timers';

interface IfiskeNotification {
  action?: string;
  message?: string;
  code?: string;
  orgid?: number;
}

export interface PushHandler {
  (notification: IfiskeNotification & NotificationData): Promise<void> | void;
}

@Injectable()
export class PushProvider {
  token: string;
  private defaultHandler: PushHandler;
  private pushHandlers: Dictionary<PushHandler[]> = {
    /*
      * We got a new fishing permit. We will get the Code of the new permit
      * Payload should contain:
      * code: fishing permit code
      */
    NEW: [(not) => {
      if (not.code) {
        this.navCtrl.push('PermitDetailPage', { id: not.code });
      }
    }],

    /*
      * We got a request to make a fishing report
      * Payload should contain:
      * orgid: organisation id,
      * code: fishing permit code,
      */
    REP_REQ: [(not) => {
      if (not.orgid && not.code) {
        this.alertCtrl.create({
          title: 'Do you want to create a catch report?',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
            },
            {
              text: 'OK',
              handler: () => {
                window.open(`${serverLocation}/r/${not.code}?lang=${this.settings.language}`, '_system');
              },
            },
          ],
        });
      }
    }],

    /*
      * Someone made a report on a area we favorited
      * Payload should contain:
      * RepId: ID of the new report
      */
    NEW_FAV: [(not) => {
      if (not.repid) {
        // this.navCtrl.push('app.report', {id: not.repid});
      }
    }],

    /*
      * Display a message
      * Payload should contain:
      * message: a string that we should Display
      */
    NOTE: [(not) => {
      if (not.message) {
        this.alertCtrl.show({
          message: not.message,
        });
      }
    }],
  };

  private navCtrl: NavController;

  constructor(
    private fcm: FCM,
    private app: App,
    private sessionData: SessionProvider,
    private alertCtrl: TranslateAlertController,
    private settings: SettingsProvider,
  ) {
    this.navCtrl = this.app.getRootNav();

    this.defaultHandler = async (notification) => {
      (await this.alertCtrl.create({
        message: notification.message,
      })).present();
    };
  }

  async initialize() {
    // TODO: send token to ifiske servers
    this.token = await this.fcm.getToken();
    console.log(this.token);
    if (this.settings.isDeveloper) {
      this.fcm.subscribeToTopic('developer');
    }
    this.fcm.subscribeToTopic('marketing');
    this.fcm.onNotification().subscribe(this.handleNotification);
  }

  private handleNotification = (notification) => {
    console.log('New push notification:', notification);

    if (notification.action && notification.action in this.pushHandlers) {
      for(const handler of this.pushHandlers[notification.action]) {
        setTimeout(() => handler(notification), 0);
      }
    } else {
      this.defaultHandler(notification);
    }
  }

  registerHandler(name: string, handler: PushHandler) {
    if (!this.pushHandlers[name]) {
      this.pushHandlers[name] = [];
    }
    this.pushHandlers[name].push(handler);
  }
}
