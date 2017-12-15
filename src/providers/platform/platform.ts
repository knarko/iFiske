import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

@Injectable()
export class PlatformProvider {

  constructor(private _platform: Platform) { }

  get platform(): string {
    if (this._platform.is('ios')) {
      return 'ios';
    } else if (this._platform.is('android')) {
      return 'android';
    } else if (this._platform.is('windows')) {
      return 'windows';
    }
    return 'unknown';
  }

  get cssClass(): string {
    if (this._platform.is('ios')) {
      return 'ios';
    } else if (this._platform.is('android')) {
      return 'md';
    } else if (this._platform.is('windows')) {
      return 'wp';
    }
    return 'unknown';
  }

}
