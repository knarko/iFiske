import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Injectable()
export class SessionProvider {
  private static readonly STORAGE_KEY = 'session';

  tokenObservable = new ReplaySubject<string>(1);

  set token(t) {
    if (!t) {
      localStorage.removeItem(SessionProvider.STORAGE_KEY);
    } else {
      localStorage.setItem(SessionProvider.STORAGE_KEY, t);
    }
    this.tokenObservable.next(t);
  }

  get token() {
    return localStorage.getItem(SessionProvider.STORAGE_KEY);
  }

  constructor() {
    this.tokenObservable.next(this.token || undefined);
  }
}
