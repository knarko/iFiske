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
  private static readonly CACHE_KEYS = 'IMGCACHE_CACHE_KEYS';
  ready: Promise<void>;

  private cache = {};

  constructor(
    private plt: Platform,
    @Inject(IMGCACHE_CONFIG) private config: ImgcacheConfig = {},
  ) {
    Object.assign(ImgCache.options, config);

    this.ready = this.plt.ready().then(() => {
      return new Promise<void>((resolve, reject) => ImgCache.init(resolve, reject));
    });

    try {
      const cacheKeys = JSON.parse(localStorage.getItem(ImgcacheService.CACHE_KEYS));
      for (const key of cacheKeys) {
        this.saveImageUriToCache(key);
      }
    } catch (err) {
      console.warn(err);
    }
  }

  private persistCache() {
    localStorage.setItem(ImgcacheService.CACHE_KEYS, JSON.stringify(Object.keys(this.cache)));
  }

  async cacheFile(src: string): Promise<string | void> {
    await this.ready;

    const isCached = await this.isCached(src);
    if (!isCached) {
      return new Promise<string>((resolve, reject) => ImgCache.cacheFile(src, resolve, reject)).then(() => this.saveImageUriToCache(src));
    }
    return this.saveImageUriToCache(src);
  }

  isCached = src => {
    return new Promise<boolean>((resolve, reject) => ImgCache.isCached(src, (_, answer) => resolve(answer)));
  };

  async saveImageUriToCache(src: string): Promise<void> {
    if (this.cache[src]) {
      return;
    }

    await this.ready;

  }

  async getCachedFile(src: string): Promise<string> {
    if (!src) {
      return '';
    }

    if (this.cache[src]) {
      return this.cache[src];
    }

    try {
      await this.ready;

      await this.cacheFile(src);

      return new Promise<string>((resolve, reject) => {
        ImgCache.getCachedFile(src, (_, img) => {
          img = img.toURL().replace(/(?:cdv)?file:\/\//, '');
          console.log(img);
          resolve(img);
        });
      });

    } catch (err) {
      console.warn(err);
      if (!isDevMode()) {
        Pro.getApp().monitoring.handleNewError(`There was an error caching '${src}'`, err);
      }
      return this.config.fallback ? src : '';
    }
  }
}
