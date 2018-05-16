import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

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
  private static defaultSettings = {
    push: true,
    language: 'sv',
    channel: 'Production',
    firstLaunch: true,
  };
  private settings: Settings = JSON.parse(localStorage.getItem(SettingsProvider.STORAGE_LOCATION));

  constructor(private translate: TranslateService, private ga: GoogleAnalytics) {
    this.settings = Object.assign({}, SettingsProvider.defaultSettings, this.settings);
    this.persistSettings();
    console.log(this.settings);
  }

  private persistSettings() {
    localStorage.setItem(SettingsProvider.STORAGE_LOCATION, JSON.stringify(this.settings));
  }

  availableLanguages: { [short: string]: Language } = {
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
    // this.pushProvider.reset();
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
