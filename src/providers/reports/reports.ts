import { Injectable } from '@angular/core';

import { ApiProvider } from '../api/api';
import { Observable } from 'rxjs/Observable';
import { map, share, tap } from 'rxjs/operators';
import { FishProvider } from '../fish/fish';
import { TechniqueProvider, Technique } from '../technique/technique';
import { BaitProvider, Bait } from '../baits/baits';
import { serverLocation } from '../api/serverLocation';
import { BaseModel } from '../database/basemodel';
import { TranslateService } from '@ngx-translate/core';
import { Omit } from '../../types';

export interface Catch {
  /** Catch type (species) */
  type: number;
  /** Number of animals catched */
  num: number;
  /** Weight, total in gram */
  wei: number;
  /** Comment (text) */
  cmt: string;
  /** Length in centimeter */
  cm: number;
  /** Flag if the animal was kept or put back */
  kept: number;
  /**
   * How the animal was spawned?
   * Enum
   * 0: Unclear unknown
   * 1: Spawned
   * 2: Not spawned
   */
  spa: number;
  /**
   * Fin type enum
   * 0: Unclear/unknown
   * 1: Without adipose fin ("Fettfena" in Swedish)
   * 2: Has adipose fin
   */
  fin: number;
  /**
   * Gender enum
   * 0: Unclear/unknown
   * 1: Female
   * 2: Male
   */
  gen: number;
}

export interface Report {
  /** Report ID */
  ID: number;
  /** Organization ID */
  org: number;
  /** Area ID */
  aid: number;
  /** Area name (text) */
  area: string;
  /** Public flag */
  pub: number;
  /** ID of mainly successful technique */
  tech: number;
  /** ID of mainly successful bait */
  bait: number;
  /** Observations (text) */
  obs: string;
  /** Fishing day */
  day: Date;
  /** Created timestamp */
  c: Date;
  /** Name of person */
  name: string;
  /** Thumbnail image */
  img1: string;
  /** Big image */
  img2: string;
  /** Pool */
  pool: string;
  /** Guide */
  guid: string;
  /** Club */
  club: string;
  /** Flag. Permit was controlled by someone? */
  ctrl: string;
  /** Array of catches */
  catches: Catch[];

  /** Promise with technique data */
  technique$: Promise<Technique | undefined>;
  /** Promise with bait data */
  bait$: Promise<Bait | undefined>;
  numberOfCatches: number;
}

type ApiReport = Omit<Report, 'day' | 'c'> & { day: number; c: number };

@Injectable()
export class ReportsProvider {
  techniqueCache = new Map<number, Promise<Technique | undefined>>();
  baitCache = new Map<number, Promise<Bait | undefined>>();
  constructor(
    private api: ApiProvider,
    private fish: FishProvider,
    private technique: TechniqueProvider,
    private bait: BaitProvider,
    private translate: TranslateService,
  ) {
    this.translate.onLangChange.subscribe(() => {
      // Clear the cache when the language changes
      this.techniqueCache = new Map();
      this.baitCache = new Map();
    });
  }

  getReports({
    filter,
    orgId,
    items,
  }: { filter?: 1; orgId?: number; items?: number } = {}): Observable<Report[]> {
    return this.api.getReports({ filter, orgId, items }).pipe(
      map((reportsObj): ApiReport[] => Object.values(reportsObj)),
      map(reports =>
        reports
          // Sort most recently created first
          .sort((a, b) => b.day - a.day)
          .map(
            (report): Report => {
              return {
                ...report,
                day: new Date(report.day * 1000),
                c: new Date(report.c * 1000),
                technique$: this.getTechnique(report.tech),
                bait$: this.getBait(report.bait),
                img1: report.img1 ? `${serverLocation}${report.img1}` : undefined,
                img2: report.img2 ? `${serverLocation}${report.img2}` : undefined,
                catches: report.catches.map(c => {
                  return {
                    ...c,
                    fish$: this.fish.getOne(c.type),
                  };
                }),
                numberOfCatches: report.catches.reduce((acc, curr) => acc + curr.num, 0),
              };
            },
          ),
      ),
      tap(reports => console.log(`Reports for ${orgId}:`, reports)),
      share(),
    );
  }

  private getTechnique(techniqueId: number): Promise<Technique | undefined> {
    return this.getFromCache(techniqueId, this.techniqueCache, this.technique);
  }

  private getBait(baitId: number): Promise<Bait | undefined> {
    return this.getFromCache(baitId, this.baitCache, this.bait);
  }

  private getFromCache<T>(
    id: number,
    cache: Map<number, Promise<T | undefined>>,
    model: BaseModel,
  ): Promise<T | undefined> {
    if (cache.has(id)) {
      return cache.get(id);
    }

    const value$ = model.getOne(id).catch(() => {
      cache.delete(id);
      return undefined;
    });

    cache.set(id, value$);

    return value$;
  }
}
