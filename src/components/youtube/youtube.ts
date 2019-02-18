import { Component, Input, ViewChild, ElementRef, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { merge } from 'rxjs';
import { fromEvent } from 'rxjs';

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
export class YoutubeComponent implements OnInit, OnChanges, OnDestroy {
  ytUrl: SafeResourceUrl;
  sub: Subscription;
  fullscreen: Observable<{}>;
  @Input() url: string;
  @ViewChild('player') player: ElementRef;

  constructor(private sanitizer: DomSanitizer, private orientation: ScreenOrientation) {
    this.fullscreen = merge(
      fromEvent(document, 'fullscreenchange'),
      fromEvent(document, 'webkitfullscreenchange'),
      fromEvent(document, 'mozfullscreenchange'),
    );
  }

  private sendMessage(func) {
    return this.player.nativeElement.contentWindow.postMessage(
      JSON.stringify({
        event: 'command',
        func: func,
        args: '',
      }),
      '*',
    );
  }

  ngOnInit() {
    this.sub = this.fullscreen.subscribe(e => {
      const fullScreenElement =
        (document as any).fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullscreenElement;
      console.log('Changing fullscreen mode', e, fullScreenElement);
      if (fullScreenElement) {
        this.orientation.lock(this.orientation.ORIENTATIONS.LANDSCAPE);
      } else {
        this.orientation.lock(this.orientation.ORIENTATIONS.PORTRAIT_PRIMARY);
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.orientation.lock(this.orientation.ORIENTATIONS.PORTRAIT_PRIMARY);
    this.sendMessage('pauseVideo');
  }

  ngOnChanges() {
    if (this.url) {
      const fullUrl = `https://www.youtube.com/embed/${this.url}?enablejsapi=1`;
      this.ytUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fullUrl);
    }
  }
}
