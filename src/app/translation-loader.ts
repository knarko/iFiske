import { TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';

import { sv } from '../i18n/sv';
import { de } from '../i18n/de';
import { en } from '../i18n/en';
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
