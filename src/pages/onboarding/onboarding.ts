import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Slides } from 'ionic-angular';
import { SettingsProvider } from '../../providers/settings/settings';
import { UpdateProvider } from '../../providers/update/update';

@IonicPage()
@Component({
  selector: 'page-onboarding',
  templateUrl: 'onboarding.html',
})
export class OnboardingPage {
  hideSkip: boolean = false;
  @ViewChild('slides') slides: Slides;
  @ViewChild('extras') extras: Slides;

  constructor(
    private navCtrl: NavController,
    private settings: SettingsProvider,
    private update: UpdateProvider,
  ) {
  }

  ionViewDidLoad() {
    this.extras.direction = 'vertical';
    this.extras.initialSlide = 4;
    this.slides.controlInverse = true;
    this.slides.control = this.extras;
    this.slides.ionSlideDidChange.subscribe(() => {
      this.hideSkip = this.slides.getActiveIndex() >= 3;
    });
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
