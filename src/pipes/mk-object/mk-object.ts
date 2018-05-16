import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mkObject',
})
export class MkObjectPipe implements PipeTransform {
  transform(value: any, key: string) {
    return { [key]: value };
  }
}
