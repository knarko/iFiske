import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChangeLanguagePage } from './change-language';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ChangeLanguagePage],
  imports: [IonicPageModule.forChild(ChangeLanguagePage), TranslateModule],
})
export class ChangeLanguagePageModule {}
