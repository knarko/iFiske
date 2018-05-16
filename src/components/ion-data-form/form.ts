import { ReflectiveInjector } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { Dictionary } from '../../types';

export interface FormControl {
  label?: string;
  placeholder?: string;
  type?: 'password' | 'text' | 'number' | 'email' | 'textarea' | 'tel';
  required?: boolean;
  validators?: ValidatorFn[];
  asyncValidators?: AsyncValidatorFn[];
  errors?: {
    [error: string]: string;
  };
  control?: AbstractControl;
}

export interface FormOptions {
  submit: (group: FormGroup) => void;
  submitMessage: string;
  errors?: Dictionary<string>;
  controls: {
    [id: string]: FormControl;
  };
}

export class Form {
  private submitHandler: (FormGroup) => void;
  readonly submitMessage: string;
  controls: { [id: string]: FormControl };

  allowSubmit: (group: FormGroup) => boolean;

  readonly controlArray: FormControl[] = [];

  group: FormGroup;
  errors: Dictionary<string>;

  private builder: FormBuilder;

  constructor(form: FormOptions) {
    this.builder = ReflectiveInjector.resolveAndCreate([FormBuilder]).get(FormBuilder);

    this.submitHandler = form.submit;
    this.submitMessage = form.submitMessage;
    this.controls = form.controls;
    this.errors = form.errors;
    const groupOptions = {};
    for (let id in this.controls) {
      groupOptions[id] = ['', this.controls[id].validators || [], this.controls[id].asyncValidators || []];
      this.controlArray.push(this.controls[id]);
    }
    this.group = this.builder.group(groupOptions);
    for (let id in this.controls) {
      this.controls[id].control = this.group.controls[id];
      const validators = this.controls[id].validators;
      if (validators && validators.some(validator => validator === Validators.required)) {
        this.controls[id].required = true;
      }
    }
    console.log(this.controlArray, this.group, this);
  }

  submit() {
    this.submitHandler(this.group);
  }
}
