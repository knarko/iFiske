import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the DistancePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'distance',
})
export class DistancePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(distance: number) {
    if (!distance || Number.isNaN(Number(distance))) {
      return '';
    }

    if (distance > 2000) {
      return Math.round(distance / 1000) + 'km';
    } else if (distance > 500) {
      return Number(distance / 1000).toPrecision(2) + 'km';
    }

    return Math.round(distance) + 'm';
  };
}
