import { Component, Input } from '@angular/core';

@Component({
  selector: 'permit-code',
  templateUrl: 'permit-code.html',
})
export class PermitCodeComponent {
  @Input() code: string;

  displayCode: string;

  ngOnChanges() {
    // u00A0 is a non-breaking space
    this.displayCode = ('' + this.code).substr(0, 4) + '\u00A0' + ('' + this.code).substr(4);
  }
}
