import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { TermsProvider } from '../../providers/terms/terms';

/**
 * Generated class for the ContactPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  defaultHistory: ['HomePage', 'SettingsPage'],
})
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage {
  contactInfo: string;

  constructor(private terms: TermsProvider) {
  }

  ionViewWillEnter() {
    this.contactInfo = this.terms.contactInfo;
  }
}
