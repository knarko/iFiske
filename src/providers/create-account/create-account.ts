import { Injectable } from '@angular/core';
import { timer } from 'rxjs/observable/timer';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { takeUntil, map } from 'rxjs/operators';

import { ApiProvider } from '../api/api';
import { UserProvider } from '../user/user';
import { MonitoringClient } from '../../app/monitoring';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';

export interface UserDetails {
  username: string;
  fullname: string;
  password: string;
  email: string;
  phone: string;
}

@Injectable()
export class CreateAccountProvider {
  private timerSubject = new ReplaySubject<Observable<number>>(1);
  timer: Observable<Observable<number>>;

  private static readonly REGISTER_DATA_KEY = 'register_user_details';

  constructor(private API: ApiProvider, private userProvider: UserProvider, private analytics: FirebaseAnalytics) {
    this.timer = this.timerSubject.asObservable();
    this.timerSubject.next(this.createTimer());
  }

  async register(userDetails: UserDetails) {
    userDetails.phone = userDetails.phone.replace(/^\+/, '00');
    const res = await this.API.user_register(userDetails);
    console.log(res);
    localStorage.setItem(CreateAccountProvider.REGISTER_DATA_KEY, JSON.stringify(userDetails));
    this.timerSubject.next(this.createTimer());
  }

  async activate({ username, activationCode }: { username?: string; activationCode: string }) {
    const userDetails = this.getSavedUserDetails();

    if (!username) {
      username = userDetails.username;
    }

    if (!username) {
      throw new Error('No username');
    }

    await this.API.user_confirm(username, activationCode);

    localStorage.removeItem(CreateAccountProvider.REGISTER_DATA_KEY);

    this.analytics.logEvent('sign_up', { method: 'password' });

    if (userDetails.password) {
      await this.userProvider.login({
        username,
        password: userDetails.password,
      });
      return true;
    }
    return false;
  }

  async retry() {
    const userDetails = this.getSavedUserDetails();
    if (!userDetails.username) {
      throw new Error('invalid');
    }
    return this.register(userDetails);
  }

  getSavedUserDetails() {
    try {
      return JSON.parse(localStorage.getItem(CreateAccountProvider.REGISTER_DATA_KEY)) || {};
    } catch (err) {
      console.error(err);
      MonitoringClient.captureException(err);
      return {};
    }
  }

  private createTimer() {
    const timerEnd = 3 * 60 * 1000; // 3 minutes
    const stop = timer(timerEnd - 1000);
    const timerStart = Date.now();
    return timer(0, 1000).pipe(
      map(() => timerEnd - (Date.now() - timerStart)),
      takeUntil(stop),
    );
  }
}
