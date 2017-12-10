import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TermsProvider } from '../../providers/terms/terms';

/**
 * Generated class for the TermsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  defaultHistory: ['HomePage', 'SettingsPage'],
})
@Component({
  selector: 'page-terms',
  templateUrl: 'terms.html',
})
export class TermsPage {
  terms: string;

  constructor(private termsProvider: TermsProvider) {
  }

  ionViewWillLoad() {
    this.terms = this.termsProvider.termsOfService;
  }

}
