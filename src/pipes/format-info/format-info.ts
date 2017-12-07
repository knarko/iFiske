import { Pipe, PipeTransform } from '@angular/core';
import { StripTagsPipe } from 'ngx-pipes';
import { LinkyPipe } from '../linky/linky';

/**
 * Formats information from the iFiske API, stripping redundant html and creates proper links
 */
@Pipe({
  name: 'formatInfo',
})
export class FormatInfoPipe implements PipeTransform {
  linky: (value: string, options?: any) => string;
  stripTags: (text: string, ...allowedTags: any[]) => string;
  private allowedTags = [
    'p',
    'a',
    'br',
    ...(Array(6).map((_, i) => `h${i+1}`)),
    'strong',
    'em',
    'i',
    'b',
  ];

  private transforms = [
    value => this.stripTags(value, ...this.allowedTags),
    value => value.replace(/<p>(?:\s|&nbsp;)*<\/p>/ig, ''),
    value => value.replace(/(?:<br\s*\/?>(?:\s|&nbsp;)*<br\s*\/?>)+/ig, '<br>'),
    value => this.linky(value),
  ];

  constructor() {
    this.stripTags = new StripTagsPipe().transform;
    this.linky = new LinkyPipe().transform;
  }

  transform(value: string, ...args) {
    for (let transform of this.transforms) {
      if (!value) {
        break;
      }
      value = transform(value);
    }
    return value;
  }
}
