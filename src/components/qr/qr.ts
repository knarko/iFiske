import { Component, Input, SimpleChanges } from '@angular/core';

/**
 * Generated class for the QrComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'app-qr',
  templateUrl: 'qr.html',
})
export class QrComponent {
  qr: string;
  @Input() image: string;
  @Input() color: 'green' | 'red' | 'gray';

  ngOnChanges(changes: SimpleChanges) {
    if (changes.image.firstChange || changes.image.currentValue !== changes.image.previousValue) {
      this.qr = `data:image/png;base64,${this.image}`;
    }
  }
  constructor() {}
}
