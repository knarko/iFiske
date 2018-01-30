import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminInfoPage } from './admin-info';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    AdminInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(AdminInfoPage),
    TranslateModule,
    ComponentsModule,
    PipesModule,
  ],
})
export class AdminInfoPageModule {}
