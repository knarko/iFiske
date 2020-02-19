import { TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs/observable/of';

import { de } from '../i18n/de';
import { en } from '../i18n/en';
import { fi } from '../i18n/fi';
import { sv } from '../i18n/sv';

import { MonitoringClient } from './monitoring';

export interface Language {
  short: string;
  long: string;
}
export const LANGUAGES: Record<string, Language> = {
  sv: {
    short: 'sv',
    long: 'Svenska',
  },
  de: {
    short: 'de',
    long: 'Deutsch',
  },
  en: {
    short: 'en',
    long: 'English',
  },
  fi: {
    short: 'fi',
    long: 'Suomi',
  },
};

export class TranslateBundleLoader implements TranslateLoader {
  private languages = {
    de,
    en,
    fi,
    se: sv,
    sv,
  };

  getTranslation(lang: string): any {
    if (lang != undefined && this.languages[lang]) {
      return of(this.languages[lang]);
    }

    MonitoringClient.captureException(new Error(`Invalid language '${lang}'`));

    // Try to return the best existing language
    if (typeof lang !== 'string' || lang.match(/^s[ev]/i)) {
      return of(this.languages.sv);
    }

    return of(this.languages.en);
  }
}
