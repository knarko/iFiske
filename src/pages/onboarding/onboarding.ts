import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, ViewController } from 'ionic-angular';
import { transition, keyframes, animate, trigger, state, style } from '@angular/animations';
import { SettingsProvider } from '../../providers/settings/settings';

@IonicPage()
@Component({
  selector: 'page-onboarding',
  templateUrl: 'onboarding.html',
  animations: [
    trigger('bounce', [
      state('*', style({
        transform: 'translateX(0)',
      })),
      transition('* => prev', animate('700ms ease-out', keyframes([
        style({ transform: 'translateX(0)', offset: 0 }),
        style({ transform: 'translateX(-65px)', offset: .3 }),
        style({ transform: 'translateX(0)', offset: 1 }),
      ]))),
      transition('* => next', animate('700ms ease-out', keyframes([
        style({ transform: 'translateX(0)', offset: 0 }),
        style({ transform: 'translateX(65px)', offset: .3 }),
        style({ transform: 'translateX(0)', offset: 1 }),
      ]))),
    ]),
    trigger('slideDown', [
      state('show', style({
        transform: 'translate3d(0,0,0)',
      })),
      state('hide', style({
        transform: 'translate3d(100%, 0, 0)',
      })),
    ]),
  ],
})
export class OnboardingPage {

  hideSkip: boolean = false;
  @ViewChild('slides') slides: Slides;
  @ViewChild('extras') extras: Slides;
  skipMsg: string = 'ui.onboarding.skip';
  state: string = 'x';
  currentSlide = 0;

  constructor(
    private navCtrl: NavController,
    private settings: SettingsProvider,
  ) {
  }

  ionViewDidLoad() {
    this.extras.direction = 'vertical';
    this.extras.initialSlide = 4;
    this.slides.controlInverse = true;
    this.slides.control = this.extras;
    this.slides.ionSlideDidChange.subscribe(() => {
      this.hideSkip = this.slides.getActiveIndex() >= 3;
      console.log(this.slides.getActiveIndex());
    });
  }

  skip() {
    // this.settings.firstLaunch = false;
    this.navCtrl.setRoot('HomePage', undefined, {
      animate: true,
      direction: 'forward',
    });
  }
}
