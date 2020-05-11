import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';
import { TermsProvider } from '../../providers/terms/terms';

@IonicPage()
@Component({
  selector: 'page-eula',
  templateUrl: 'eula.html',
})
export class EulaPage {
  terms: string;
  constructor(
    private termsProvider: TermsProvider,
    private viewCtrl: ViewController,
  ) {}

  ionViewWillEnter() {
    this.terms = this.termsProvider.termsOfService;
  }

  close() {
    return this.viewCtrl.dismiss();
  }
}
