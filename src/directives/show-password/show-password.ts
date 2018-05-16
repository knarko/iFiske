import { Directive } from '@angular/core';

/**
 * Generated class for the ShowPasswordDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[show-password]', // Attribute selector
})
export class ShowPasswordDirective {
  constructor() {
    console.log('Hello ShowPasswordDirective Directive');
  }
}
