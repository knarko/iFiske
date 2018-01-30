import { Component, Input } from '@angular/core';

import { User } from '../../providers/user/user';

@Component({
  selector: 'user-information, [user-information]',
  templateUrl: 'user-information.html',
})
export class UserInformationComponent {
  @Input() user: User;
}
