import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';
import { SettingsProvider, Language } from '../../providers/settings/settings';
import { StatusBar } from '@ionic-native/status-bar';

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
    private statusBar: StatusBar,
  ) {
  }

  close() {
    this.viewCtrl.dismiss();
  }

  changed() {
    if (this.settings.language === this.currentLanguage || !this.currentLanguage) {
      return;
    }
    this.settings.language = this.currentLanguage;
    this.close();
  }

  ionViewDidEnter() {
    this.statusBar.styleDefault();
  }

  ionViewWilLeave() {
    this.statusBar.styleBlackTranslucent();
  }

  ionViewWillEnter() {
    this.languages = Object.values(this.settings.availableLanguages);
    this.currentLanguage = this.settings.language;
  }

}
