import { NgModule } from '@angular/core';
import { DistancePipe } from './distance/distance';
import { StripTagsPipe } from 'ngx-pipes';
import { FormatInfoPipe } from './format-info/format-info';
import { LinkyPipe } from './linky/linky';
import { KeysPipe } from './keys/keys';

@NgModule({
	declarations: [
    DistancePipe,
    StripTagsPipe,
    FormatInfoPipe,
    LinkyPipe,
    KeysPipe,
  ],
	exports: [
    DistancePipe,
    StripTagsPipe,
    FormatInfoPipe,
    LinkyPipe,
    KeysPipe,
  ],
})
export class PipesModule {}
