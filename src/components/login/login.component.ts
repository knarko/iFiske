import { Component, EventEmitter, Output } from '@angular/core';
import { UserProvider } from '../../providers/user/user';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { TranslateLoadingController } from '../../providers/translate-loading-controller/translate-loading-controller';
import { Form } from '../ion-data-form/form';
import { ApiError } from '../../providers/api/api';

@Component({
  selector: 'login',
  templateUrl: 'login.component.html',
})
export class LoginComponent {

}
