import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keys',
  pure: false,
})
export class KeysPipe implements PipeTransform {
  transform(value: any, _args?: any): any[] {
    if (!value) {
      return [];
    }
    return Object.keys(value);
  }
}
