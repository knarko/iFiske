import { Injectable } from '@angular/core';

import { ApiProvider } from '../api/api';

@Injectable()
export class TermsProvider {
  private static TOS_LOCATION = 'tos';
  private static SMS_TERMS_LOCATION = 'sms_terms';
  private static CONTACT_LOCATION = 'contact_info';

  readonly updateStrategy = 'always';

  constructor(private API: ApiProvider) { }

  async update(): Promise<boolean> {
    const [tos, smsTerms, contact] = await Promise.all([
      this.API.get_terms_of_service(),
      this.API.get_sms_terms(),
      this.API.get_contact_info(),
    ]);

    localStorage.setItem(TermsProvider.TOS_LOCATION, tos);
    localStorage.setItem(TermsProvider.SMS_TERMS_LOCATION, smsTerms);
    localStorage.setItem(TermsProvider.CONTACT_LOCATION, contact);

    return true;
  }

  get termsOfService() {
    return localStorage.getItem(TermsProvider.TOS_LOCATION);
  }

  get smsTerms() {
    return localStorage.getItem(TermsProvider.SMS_TERMS_LOCATION);
  }

  get contactInfo() {
    return localStorage.getItem(TermsProvider.CONTACT_LOCATION);
  }

}
