import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Slides, ModalController } from 'ionic-angular';
import { SettingsProvider } from '../../providers/settings/settings';
import { UpdateProvider } from '../../providers/update/update';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { LANGUAGES, Language } from '../../app/translation-loader';

@IonicPage()
@Component({
  selector: 'page-onboarding',
  templateUrl: 'onboarding.html',
})
export class OnboardingPage {
  hideSkip: boolean = false;
  @ViewChild('slides')
  slides: Slides;
  @ViewChild('extras')
  extras: Slides;
  language: Observable<Language>;

  constructor(
    private navCtrl: NavController,
    private settings: SettingsProvider,
    private update: UpdateProvider,
    private modalCtrl: ModalController,
  ) {}

  ionViewDidLoad() {
    this.language = this.settings.settingsChanged.pipe(
      startWith({ language: this.settings.language }),
      map(settings => LANGUAGES[settings.language]),
    );
    this.extras.direction = 'vertical';
    this.extras.initialSlide = 4;
    this.slides.controlInverse = true;
    this.slides.control = this.extras;
    this.slides.ionSlideDidChange.subscribe(() => {
      this.hideSkip = this.slides.getActiveIndex() >= 3;
    });
  }
  changeLanguage() {
    this.modalCtrl.create('ChangeLanguagePage').present();
  }

  next() {
    this.slides.slideNext();
  }

  skip() {
    if (this.update.updating) {
      this.update.showLoading();
    }

    this.settings.firstLaunch = false;
    this.navCtrl.setRoot('HomePage', undefined, {
      animate: true,
      direction: 'forward',
    });
  }
}
