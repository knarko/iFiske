import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import { Subscription } from 'rxjs/Subscription';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

/**
 * Generated class for the YoutubeComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'youtube',
  templateUrl: 'youtube.html',
})
export class YoutubeComponent {
  ytUrl: SafeResourceUrl;
  sub: Subscription;
  fullscreen: Observable<{}>;
  @Input() url: string;
  @ViewChild('player') player: ElementRef;

  constructor(
    private sanitizer: DomSanitizer,
    private orientation: ScreenOrientation,
  ) {
    this.fullscreen = Observable.merge(
      Observable.fromEvent(document, 'fullscreenchange'),
      Observable.fromEvent(document, 'webkitfullscreenchange'),
      Observable.fromEvent(document, 'mozfullscreenchange'),
    );
  }

  private sendMessage(func) {
    return this.player.nativeElement.contentWindow.postMessage(JSON.stringify({
      event: 'command',
      func: func,
      args: '',
    }), '*');
  }

  start() {
    this.sub = this.fullscreen.subscribe(e => {
      console.log('Changing fullscreen mode', e);
      const fullScreenElement = document.fullscreenElement ||
        document.webkitFullscreenElement ||
        (document as any).mozFullscreenElement;
      console.log(fullScreenElement);
      if (fullScreenElement) {
        this.orientation.unlock();
      } else {
        this.orientation.lock('portrait');
      }
    });
  }

  stop() {
    this.sub.unsubscribe();
    this.orientation.lock('portrait');
    this.sendMessage('pauseVideo');
  }

  ngOnChanges() {
    if (this.url) {
      const fullUrl = `https://www.youtube.com/embed/${this.url}?enablejsapi=1`;
      this.ytUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fullUrl);
    }
  }
}
