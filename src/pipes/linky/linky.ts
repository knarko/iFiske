import { Pipe, PipeTransform } from '@angular/core';
import * as Autolinker from 'autolinker';

@Pipe({
  name: 'linky',
})
export class LinkyPipe implements PipeTransform {
  linker: any;

  constructor() {
    this.linker = new Autolinker({
      truncate: {
        length: 32, location: 'middle',
      },
      replaceFn: (match: any) => {
        var tag = match.buildTag();  // returns an Autolinker.HtmlTag instance
        tag.setAttr('target', '_system');
        return tag;
      },
    });
  }

  transform = (value: string): string => {
    if (typeof value !== 'string') {
      return value;
    }
    return this.linker.link(value);
  }

}
