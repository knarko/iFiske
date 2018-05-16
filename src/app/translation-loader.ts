import { TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';

import * as sv from '../assets/i18n/sv.json';
import * as de from '../assets/i18n/de.json';
import * as en from '../assets/i18n/en.json';
import { MonitoringClient } from './monitoring';

export class TranslateBundleLoader implements TranslateLoader {
  private languages = {
    se: sv,
    sv,
    en,
    de,
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
