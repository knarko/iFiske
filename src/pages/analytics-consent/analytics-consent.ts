import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';
import { TranslateAlertController } from '../../providers/translate-alert-controller/translate-alert-controller';
import { TermsProvider } from '../../providers/terms/terms';

/**
 * Generated class for the AnalyticsConsentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-analytics-consent',
  templateUrl: 'analytics-consent.html',
})
export class AnalyticsConsentPage implements AfterViewInit {
  constructor(
    private viewCtrl: ViewController,
    private elementRef: ElementRef,
    private alertCtrl: TranslateAlertController,
    private termsProvider: TermsProvider,
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad AnalyticsConsentPage');
  }
  ngAfterViewInit() {
    const link: HTMLAnchorElement = this.elementRef.nativeElement.querySelector(
      '.content a',
    );
    link.addEventListener('click', this.openFullTerms);
  }
  openFullTerms = async () => {
    await this.alertCtrl.show(
      {
        cssClass: 'alert-large alert-terms',
        message: this.termsProvider.termsOfService,
        title: 'Terms of service',
        buttons: [{ text: 'OK' }],
      },
      ['title'],
    );
  };
  close(action: string) {
    this.viewCtrl.dismiss(action);
  }
}
