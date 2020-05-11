import { NgModule } from '@angular/core';

import {
  ImgcacheService,
  IMGCACHE_CONFIG,
  ImgcacheConfig,
} from './imgcache.service';
import { ImgcacheDirective } from './imgcache.directive';
import { ModuleWithProviders } from '@angular/core/src/metadata/ng_module';

@NgModule({
  declarations: [ImgcacheDirective],
  providers: [ImgcacheService],
  exports: [ImgcacheDirective],
})
export class ImgcacheModule {
  static forRoot(config: ImgcacheConfig = {}): ModuleWithProviders {
    return {
      ngModule: ImgcacheModule,
      providers: [
        { provide: IMGCACHE_CONFIG, useValue: config },
        ImgcacheService,
      ],
    };
  }
}
