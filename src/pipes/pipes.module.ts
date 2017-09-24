import { NgModule } from '@angular/core';
import { DistancePipe } from './distance/distance';
import { StripTagsPipe } from 'ngx-pipes/src/app/pipes/string/strip-tags';
import { FormatInfoPipe } from './format-info/format-info';
import { LinkyPipe } from './linky/linky';

@NgModule({
	declarations: [
    DistancePipe,
    StripTagsPipe,
    FormatInfoPipe,
    LinkyPipe,
  ],
	exports: [
    DistancePipe,
    StripTagsPipe,
    FormatInfoPipe,
    LinkyPipe,
  ],
})
export class PipesModule {}
