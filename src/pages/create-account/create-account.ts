import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { Form } from '../../components/ion-data-form/form';
import { FormGroup, Validators, AsyncValidatorFn } from '@angular/forms';
import { Validator } from '@angular/forms/src/directives/validators';
import { AbstractControl } from '@angular/forms/src/model';
import { ApiProvider } from '../../providers/api/api';
import { timer } from 'rxjs/observable/timer';
import { switchMap } from 'rxjs/operators';

@IonicPage({
  segment: 'create-account',
  defaultHistory: ['HomePage'],
})
@Component({
  selector: 'page-create-account',
  templateUrl: 'create-account.html',
})
export class CreateAccountPage {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private API: ApiProvider,
  ) {
  }
}
