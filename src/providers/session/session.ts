import { Injectable } from '@angular/core';

@Injectable()
export class SessionProvider {
  private static readonly STORAGE_KEY = 'session';

  set token(t) {
    if (!t) {
      localStorage.removeItem(SessionProvider.STORAGE_KEY);
    } else {
      localStorage.setItem(SessionProvider.STORAGE_KEY, t);
    }
  }

  get token() {
    return localStorage.getItem(SessionProvider.STORAGE_KEY);
  }
}
