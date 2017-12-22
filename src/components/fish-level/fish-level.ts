import { Component, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'fish-level',
  templateUrl: 'fish-level.html',
})
export class FishLevelComponent {

  @Input() level: '1' | '2' | '3' | '4' | '5' | 1 | 2 | 3 | 4 | 5;
  @HostBinding('class.show-icon')
  @Input() icon: boolean = false;

  constructor() { }
}
