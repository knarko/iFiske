import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Dictionary } from '../../types';

interface Settings {
  push: boolean;
  language: string;
  isDeveloper?: boolean;
  channel: string;
  firstLaunch: boolean;
}

export interface Language {
  short: string;
  long: string;
}

@Injectable()
export class SettingsProvider {
  private static STORAGE_LOCATION = 'settings';
  private get defaultSettings() {
    return {
      push: true,
      language: this.defaultLanguage,
      channel: 'Production',
      firstLaunch: true,
    };
  }
  get defaultLanguage() {
    for (const lang of navigator.languages) {
      if (this.availableLanguages[lang]) {
        return lang;
      }
    }
    if (typeof navigator.language !== 'string' || navigator.language.match(/^s[ev]/i)) {
      return 'sv';
    }
    return 'en';
  }
  private settings: Settings = JSON.parse(localStorage.getItem(SettingsProvider.STORAGE_LOCATION));

  settingsChanged = new ReplaySubject<Settings>(1);

  constructor(private translate: TranslateService, private ga: GoogleAnalytics) {
    this.settings = Object.assign({}, this.defaultSettings, this.settings);
    this.language = this.settings.language;
    this.persistSettings();
    console.log(this.settings);
  }

  private persistSettings() {
    localStorage.setItem(SettingsProvider.STORAGE_LOCATION, JSON.stringify(this.settings));
    this.settingsChanged.next(this.settings);
  }

  availableLanguages: Dictionary<Language> = {
    sv: {
      short: 'sv',
      long: 'Svenska',
    },
    en: {
      short: 'en',
      long: 'English',
    },
    de: {
      short: 'de',
      long: 'Deutsch',
    },
  };

  get language() {
    return this.settings.language;
  }

  set language(lang: string) {
    this.settings.language = lang;
    this.persistSettings();
    this.translate.use(this.settings.language);
    document.getElementsByTagName('html').item(0).lang = lang;

    this.ga.trackEvent('Language', 'changed', this.settings.language);
  }

  get push() {
    return this.settings.push;
  }

  set push(push: boolean) {
    this.settings.push = push;
    this.persistSettings();
  }

  get isDeveloper() {
    return this.settings.isDeveloper;
  }

  set isDeveloper(state: boolean) {
    this.settings.isDeveloper = state;
    this.persistSettings();
  }

  get channel() {
    return this.settings.channel;
  }
  set channel(channel: string) {
    this.settings.channel = channel;
    this.persistSettings();
  }

  get firstLaunch() {
    return this.settings.firstLaunch;
  }
  set firstLaunch(firstLaunch: boolean) {
    this.settings.firstLaunch = firstLaunch;
    this.persistSettings();
  }
}
