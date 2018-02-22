import { Injectable, InjectionToken, Inject, isDevMode } from '@angular/core';
import { Platform } from 'ionic-angular';
import * as ImgCache from 'imgcache.js';
import { Pro } from '@ionic/pro';

export const IMGCACHE_CONFIG = new InjectionToken<ImgcacheConfig>('IMGCACHE_CONFIG')

export interface ImgcacheConfig {
  /**
   * Whether to call the log method
   */
  debug?: boolean;
  /**
   * Name of the cache folder
   */
  localCacheFolder?: string;
  /**
   * use src="data:.."? otherwise will use src="filesystem:.."
   */
  useDataURI?: boolean;
  /**
   * allocated cache space : default 10MB
   */
  chromeQuota?: number;
  /**
   * false = use temporary cache storage
   */
  usePersistentCache?: boolean;
  /**
   * size in MB that triggers cache clear on init, 0 to disable
   */
  cacheClearSize?: number;
  /**
   * HTTP headers for the download requests -- e.g: headers: { 'Accept': 'application/jpg' }
   */
  headers?: { [key: string]: string };

  /**
   * indicates whether or not cross-site Access-Control requests should be made using credentials
   */
  withCredentials?: boolean;
  /**
   * enable if URIs are already encoded (skips call to sanitizeURI)
   */
  skipURIencoding?: boolean;
  /**
   * if specified, use one of the Cordova File plugin's app directories for storage
   */
  cordovaFilesystemRoot?: string;
  /**
   * timeout delay in ms for xhr request
   */
  timeout?: number;

  /**
   * Whether to fallback to original src if there is an error fetching the image
   */
  fallback?: boolean;
}

@Injectable()
export class ImgcacheService {
  ready: Promise<void>;

  constructor(
    private plt: Platform,
    @Inject(IMGCACHE_CONFIG) private config: ImgcacheConfig = {},
  ) {
    Object.assign(ImgCache.options, config);

    this.ready = this.plt.ready().then(() => {
      return new Promise<void>((resolve, reject) => ImgCache.init(resolve, reject));
    });
  }

  async cacheFile(src: string): Promise<string> {
    await this.ready;

    const isCached = await this.isCached(src);
    if (!isCached) {
      return new Promise<string>((resolve, reject) => ImgCache.cacheFile(src, resolve, reject));
    }
    return this.getCachedFileURLHelper(src);
  }

  isCached = src => {
    return new Promise<boolean>((resolve, reject) => ImgCache.isCached(src, (_, answer) => resolve(answer)));
  };

  private getCachedFileURLHelper = src => {
    return new Promise<string>((resolve, reject) => ImgCache.getCachedFileURL(src, (_, res) => resolve(res), reject));
  };

  async getCachedFileURL(src: string): Promise<string> {
    if (!src) {
      return '';
    }
    try {
      await this.ready;

      const isCached = await this.isCached(src);

      if (!isCached) {
        return await this.cacheFile(src);
      }
    } catch (err) {
      if (!isDevMode()) {
        Pro.getApp().monitoring.handleNewError(`There was an error caching '${src}'`, err);
      }

      return this.config.fallback ? src : '';
    }
    return this.getCachedFileURLHelper(src);
  }

}
