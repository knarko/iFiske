import { MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';
import { MonitoringClient } from './monitoring';

export class MissingTranslationError extends Error {
  constructor(key: string) {
    super();
    this.message = `Translation missing for '${key}'`;
    this.name = 'MissingTranslationError';
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MissingTranslationError);
    }
  }
}

export class LogMissingTranslationHandler implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams) {
    console.warn('Missing translation!', params.key);
    MonitoringClient.captureException(new MissingTranslationError(params.key));
  }
}
