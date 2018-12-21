import { Component, Input } from '@angular/core';
import { Log } from '../../providers/admin/adminTypes';

@Component({
  selector: 'app-permit-log',
  templateUrl: 'permit-log.html',
})
export class PermitLogComponent {
  @Input()
  log: Log[];

  constructor() {}
}
