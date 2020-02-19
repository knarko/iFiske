import { NgModule } from '@angular/core';
import { DistancePipe } from './distance/distance';
import { NgStringPipesModule } from 'ngx-pipes';
import { FormatInfoPipe } from './format-info/format-info';
import { LinkyPipe } from './linky/linky';
import { KeysPipe } from './keys/keys';
import { MkObjectPipe } from './mk-object/mk-object';
import { WeightPipe } from './weight/weight.pipe';

@NgModule({
  declarations: [DistancePipe, FormatInfoPipe, LinkyPipe, KeysPipe, MkObjectPipe, WeightPipe],
  imports: [NgStringPipesModule],
  exports: [NgStringPipesModule, DistancePipe, FormatInfoPipe, LinkyPipe, KeysPipe, MkObjectPipe, WeightPipe],
})
export class PipesModule {}
