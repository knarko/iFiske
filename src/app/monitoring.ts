import { Injectable, isDevMode } from '@angular/core';
import { IonicErrorHandler } from 'ionic-angular';
import { SentryClient } from '@sentry/browser';
import { APP_VERSION } from './config';

SentryClient.create({
  dsn: 'https://65d073d56d014385a2aca1276216cb91:0ce3e03a6ee04538937fde70b90b0b81@sentry.io/300552',
  release: APP_VERSION,
});

export const MonitoringClient = SentryClient;

@Injectable()
export class MonitoringErrorHandler extends IonicErrorHandler {
  public handleError(err: any): void {
    if (isDevMode() && err && err.message && err.message.indexOf('cordova_not_available') !== -1) {
      return;
    }

    if (!isDevMode()) {
      // Only log errors to remote when running in production
      try {
        SentryClient.captureException(err.originalError || err);
      } catch (e) {
        console.error(e);
      }
    }

    super.handleError(err);
  }
}
