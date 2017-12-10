import { NgModule } from '@angular/core';
import { DistancePipe } from './distance/distance';
import { NgStringPipesModule } from 'ngx-pipes';
import { FormatInfoPipe } from './format-info/format-info';
import { LinkyPipe } from './linky/linky';
import { KeysPipe } from './keys/keys';

@NgModule({
	declarations: [
    DistancePipe,
    FormatInfoPipe,
    LinkyPipe,
    KeysPipe,
  ],
  imports: [
    NgStringPipesModule,
  ],
	exports: [
    NgStringPipesModule,
    DistancePipe,
    FormatInfoPipe,
    LinkyPipe,
    KeysPipe,
  ],
})
export class PipesModule {}
