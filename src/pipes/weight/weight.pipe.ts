import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'weight', pure: true })
export class WeightPipe implements PipeTransform {
  transform(value: number): string[] {
    if (value > 999) {
      return [`${(value / 1000).toFixed(1)}`, 'kg'];
    }
    return [`${value.toFixed(0)}`, 'g'];
  }
}
