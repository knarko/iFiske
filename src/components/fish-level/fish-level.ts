import { Component, Input } from '@angular/core';

/**
 * Generated class for the FishLevelComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'fish-level',
  templateUrl: 'fish-level.html',
})
export class FishLevelComponent {

  @Input() level: '1' | '2' | '3' | '4' | '5' | 1 | 2 | 3 | 4 | 5;
  @Input() icon: boolean = false;

  constructor() {
  }

}
