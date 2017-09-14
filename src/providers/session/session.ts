import { Injectable } from '@angular/core';

@Injectable()
export class SessionProvider {
  private static readonly STORAGE_KEY = 'session';

  token: string;

  constructor() {
    this.token = localStorage.getItem(SessionProvider.STORAGE_KEY);
  }

  setToken = function (t) {
    localStorage.setItem(SessionProvider.STORAGE_KEY, t);
    this.token = t;
    console.log('token set');
  };
  deleteToken = function () {
    localStorage.removeItem(SessionProvider.STORAGE_KEY);
    this.token = null;
    console.log('token unset');
  };
}
