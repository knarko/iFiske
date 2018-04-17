import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OnboardingPage } from './onboarding';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    OnboardingPage,
  ],
  imports: [
    CommonModule,
    IonicPageModule.forChild(OnboardingPage),
    TranslateModule,
  ],
})
export class OnboardingPageModule { }
