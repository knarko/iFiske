import { MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';
import { MonitoringClient } from './monitoring';
import { take, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

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

function fallbackLanguage(lang: string) {
  switch (lang) {
    case 'de':
      return 'en';
    default:
      return 'sv';
  }
}

export class LogMissingTranslationHandler implements MissingTranslationHandler {
  currentLang?: string;
  loops = 0;
  handle({ key, translateService, interpolateParams }: MissingTranslationHandlerParams) {
    this.loops++;
    MonitoringClient.captureException(new MissingTranslationError(key));
    const currentLang = this.currentLang || translateService.currentLang;

    console.warn(`Missing translation for ${currentLang}: '${key}'`);

    let lang = fallbackLanguage(currentLang);
    if (lang === currentLang || this.loops > 10) {
      delete this.currentLang;
      this.loops = 0;
      return key;
    }
    return translateService.getTranslation(lang).pipe(
      take(1),
      switchMap(translations => {
        if (translations) {
          const res = translateService.getParsedResult(translations, key, interpolateParams);
          if (typeof res.subscribe === 'function') {
            this.currentLang = lang;
            return res;
          }
          return of(res);
        }
        return key;
      }),
      map(value => {
        delete this.currentLang;
        this.loops = 0;
        if (!value) {
          return key;
        }
        return value;
      }),
    );
  }
}
