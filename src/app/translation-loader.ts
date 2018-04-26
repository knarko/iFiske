import { TranslateLoader } from '@ngx-translate/core'
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';

import * as sv from '../assets/i18n/sv.json';
import * as de from '../assets/i18n/de.json';
import * as en from '../assets/i18n/en.json';


export class TranslateBundleLoader implements TranslateLoader {
  private languages = {
    sv,
    de,
    en,
  }

  getTranslation(lang: string): any {
    if (this.languages[lang]) {
      return of(this.languages[lang]);
    }
    return _throw(`No translations found for ${lang}`);
  }

}
