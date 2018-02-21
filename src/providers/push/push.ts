import { Injectable } from '@angular/core';
import { NavController, App } from 'ionic-angular';
import { SettingsProvider } from '../settings/settings';
import { serverLocation } from '../api/serverLocation';
import { TranslateAlertController } from '../translate-alert-controller/translate-alert-controller';
import { FCM, NotificationData } from '@ionic-native/fcm';
import { Dictionary } from '../../types';

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
  sub: any;
  token: string;
  private defaultHandler: PushHandler = (notification) => {
    this.alertCtrl.show({
      message: notification.message,
    });
  };

  private pushHandlers: Dictionary<PushHandler[]> = {
    /*
      * We got a new fishing permit. We will get the Code of the new permit
      * Payload should contain:
      * code: fishing permit code
      */
    NEW: [(notification) => {
      if (notification.code) {
        this.navCtrl.push('PermitDetailPage', { ID: notification.code });
      }
    }],

    /*
      * We got a request to make a fishing report
      * Payload should contain:
      * orgid: organisation id,
      * code: fishing permit code,
      */
    REP_REQ: [(notification) => {
      if (notification.orgid && notification.code) {
        this.alertCtrl.show({
          title: 'Do you want to create a catch report?',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
            },
            {
              text: 'OK',
              handler: () => {
                window.open(`${serverLocation}/r/${notification.code}?lang=${this.settings.language}`, '_system');
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
    NEW_FAV: [(notification) => {
      if (notification.repid) {
        // this.navCtrl.push('app.report', {id: notification.repid});
      }
    }],

    /*
      * Display a message
      * Payload should contain:
      * message: a string that we should Display
      */
    NOTE: [(notification) => {
      if (notification.message) {
        this.alertCtrl.show({
          title: notification.title,
          message: notification.message,
        });
      }
    }],
  };

  private navCtrl: NavController;

  constructor(
    private fcm: FCM,
    private app: App,
    private alertCtrl: TranslateAlertController,
    private settings: SettingsProvider,
  ) {
    this.navCtrl = this.app.getRootNav();

  }

  async register() {
    if (this.token) {
      this.unregister();
    }
    // TODO: send token to ifiske servers
    (window as any).FCMPlugin.requestPermissionOnIOS();
    this.token = await this.fcm.getToken();

    console.log(this.token);

    // TODO: handle subscriptions to topics better, allow opt-out and so
    if (this.settings.isDeveloper) {
      this.fcm.subscribeToTopic('developer');
    }

    this.fcm.subscribeToTopic('marketing');
    this.sub = this.fcm.onNotification().subscribe(this.handleNotification);
  }

  unregister() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    this.token = undefined;

    this.fcm.unsubscribeFromTopic('developer');
    this.fcm.unsubscribeFromTopic('marketing');

  }

  private handleNotification = (notification: IfiskeNotification & NotificationData) => {
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
