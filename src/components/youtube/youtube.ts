import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
  OnChanges,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { merge } from 'rxjs/observable/merge';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subject } from 'rxjs/Subject';

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
  @Input() url: string;
  @ViewChild('player') player: ElementRef;

  private fullscreen: Observable<{}>;
  private destroyed$ = new Subject<void>();

  constructor(
    private sanitizer: DomSanitizer,
    private orientation: ScreenOrientation,
  ) {
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
    this.fullscreen.takeUntil(this.destroyed$).subscribe(
      (e) => {
        const fullScreenElement =
          document.fullscreenElement ||
          document.webkitFullscreenElement ||
          (document as any).mozFullscreenElement;
        console.log('Changing fullscreen mode', e, fullScreenElement);
        if (fullScreenElement) {
          this.orientation
            .lock(this.orientation.ORIENTATIONS.LANDSCAPE)
            .catch(console.warn);
        } else {
          this.orientation
            .lock(this.orientation.ORIENTATIONS.PORTRAIT_PRIMARY)
            .catch(console.warn);
        }
      },
      undefined,
      () => {
        this.orientation
          .lock(this.orientation.ORIENTATIONS.PORTRAIT_PRIMARY)
          .catch(console.warn);
      },
    );
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.sendMessage('pauseVideo');
  }

  ngOnChanges() {
    if (this.url) {
      const fullUrl = `https://www.youtube.com/embed/${this.url}?enablejsapi=1`;
      this.ytUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fullUrl);
    }
  }
}
