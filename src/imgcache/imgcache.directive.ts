import { Directive, Input, ElementRef, Renderer2, OnChanges } from '@angular/core';

import { ImgcacheService } from './imgcache.service';

@Directive({
  selector: '[icSrc]',
})
export class ImgcacheDirective implements OnChanges {
  private el: HTMLElement;

  @Input('icSrc')
  src: string;

  @Input('fallback')
  fallback: string;

  @Input('icBackground')
  isBackground: boolean = false;

  constructor(
    el: ElementRef,
    private renderer: Renderer2,
    private imgcache: ImgcacheService,
  ) {
    this.el = el.nativeElement;
  }

  ngOnChanges() {
    this.imgcache.getCachedFileURL(this.src).then(cachedImage => {
      if (this.isBackground) {
        const url = `url('${cachedImage}')`;
        if (this.el.style.backgroundImage !== url) {
          if (cachedImage) {
            this.renderer.setStyle(this.el, 'background-image', url);
          } else if (this.fallback) {
            this.renderer.setStyle(this.el, 'background-image', this.fallback);
          } else {
            this.renderer.removeStyle(this.el, 'background-image');
          }
        }
      } else if (this.el.getAttribute('src') !== cachedImage) {
        if (cachedImage) {
          this.renderer.setAttribute(this.el, 'src', cachedImage);
        } else if (this.fallback) {
          this.renderer.setAttribute(this.el, 'src', this.fallback);
        } else {
          this.renderer.removeAttribute(this.el, 'src');
        }
      }
    });
  }

}
