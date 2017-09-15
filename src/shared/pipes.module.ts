import { NgModule } from '@angular/core';
import { StripTagsPipe } from 'ngx-pipes/src/app/pipes/string';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    StripTagsPipe,
  ],
  imports: [
    CommonModule,
  ],
  providers: [
    StripTagsPipe,
  ],
  exports: [
    StripTagsPipe,
  ]
})
export class PipesModule {}
