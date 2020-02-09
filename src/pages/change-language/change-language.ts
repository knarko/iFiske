import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';
import { SettingsProvider } from '../../providers/settings/settings';
import { StatusBar } from '@ionic-native/status-bar';
import { LANGUAGES } from '../../app/translation-loader';

@IonicPage()
@Component({
  selector: 'page-change-language',
  templateUrl: 'change-language.html',
})
export class ChangeLanguagePage {
  currentLanguage: string;
  languages = Object.values(LANGUAGES);

  constructor(private viewCtrl: ViewController, private settings: SettingsProvider, private statusBar: StatusBar) {}

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

  ionViewWillLeave() {
    this.statusBar.styleBlackTranslucent();
  }

  ionViewWillEnter() {
    this.currentLanguage = this.settings.language;
  }
}
