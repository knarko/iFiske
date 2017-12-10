import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';
import { SettingsProvider, Language } from '../../providers/settings/settings';

@IonicPage()
@Component({
  selector: 'page-change-language',
  templateUrl: 'change-language.html',
})
export class ChangeLanguagePage {
  currentLanguage: string;
  languages: Language[];

  constructor(
    private viewCtrl: ViewController,
    private settings: SettingsProvider,
  ) {
  }

  close() {
    this.viewCtrl.dismiss();
  }

  changed() {
    if (this.settings.language === this.currentLanguage) {
      return;
    }
    this.settings.language = this.currentLanguage;
    this.close();
  }

  ionViewWillEnter() {
    this.languages = Object.values(this.settings.availableLanguages);
    this.currentLanguage = this.settings.language;
  }

}
