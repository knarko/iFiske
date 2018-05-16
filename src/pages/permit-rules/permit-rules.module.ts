import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { PermitRulesPage } from './permit-rules';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [PermitRulesPage],
  imports: [IonicPageModule.forChild(PermitRulesPage), TranslateModule, PipesModule],
})
export class PermitRulesPageModule {}
