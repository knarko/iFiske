import { Injectable } from '@angular/core';
import { IonicErrorHandler } from 'ionic-angular';
import * as SentryClient from '@sentry/browser';
import { APP_VERSION, isProdMode } from './config';

SentryClient.init({
  dsn: 'https://65d073d56d014385a2aca1276216cb91@sentry.io/300552',
  release: APP_VERSION,
  beforeSend: (event: SentryClient.SentryEvent & { culprit?: string }) => {
    if (event.culprit) {
      event.culprit = event.culprit.substring(event.culprit.lastIndexOf('/'));
    }
    const st: SentryClient.Stacktrace =
      event.stacktrace || (event.exception && event.exception[0] && event.exception[0].stacktrace);
    if (st) {
      st.frames.forEach(frame => {
        frame.filename = frame.filename.substring(frame.filename.lastIndexOf('/'));
      });
    }

    return event;
  },
});

export const MonitoringClient = SentryClient;

@Injectable()
export class MonitoringErrorHandler extends IonicErrorHandler {
  public handleError(err: any): void {
    if (!isProdMode() && err && err.message && err.message.indexOf('cordova_not_available') !== -1) {
      return;
    }

    if (isProdMode()) {
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
