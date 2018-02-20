import { Injectable, Injector, ErrorHandler, isDevMode } from '@angular/core';
import { Pro } from '@ionic/pro';
import { IonicErrorHandler } from 'ionic-angular';
import { APP_VERSION, APP_ID } from './config';

export const IonicPro = Pro.init(APP_ID, {
  appVersion: APP_VERSION,
});

@Injectable()
export class IonicProErrorHandler implements ErrorHandler {
  ionicErrorHandler: IonicErrorHandler;

  constructor(injector: Injector) {
    try {
      this.ionicErrorHandler = injector.get(IonicErrorHandler);
    } catch(e) {
      // Unable to get the IonicErrorHandler provider, ensure
      // IonicErrorHandler has been added to the providers in app.module.ts
    }
  }

  handleError(err: any): void {
    if (err && err.message && err.message.indexOf('cordova_not_available') !== -1) {
      return;
    }

    if (!isDevMode()) {
      // Only log to Ionic Pro when running in prod mode
      IonicPro.monitoring.handleNewError(err);
    }

    this.ionicErrorHandler && this.ionicErrorHandler.handleError(err);
  }
}
