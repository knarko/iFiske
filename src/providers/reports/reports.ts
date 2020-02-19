import { Injectable } from '@angular/core';

import { ApiProvider } from '../api/api';
import { Observable } from 'rxjs/Observable';
import { map, share } from 'rxjs/operators';
import { FishProvider } from '../fish/fish';
import { TechniqueProvider } from '../technique/technique';
import { BaitProvider } from '../baits/baits';
import { serverLocation } from '../api/serverLocation';

export interface Catch {
  /** Catch type (species) */
  type: string;
  /** Number of animals catched */
  num: string;
  /** Weight, total in gram */
  wei: string;
  /** Comment (text) */
  cmt: string;
  /** Length in centimeter */
  cm: string;
  /** Flag if the animal was kept or put back */
  kept: string;
  /**
   * How the animal was spawned?
   * Enum
   * 0: Unclear unknown
   * 1: Spawned
   * 2: Not spawned
   */
  spa: string;
  /**
   * Fin type enum
   * 0: Unclear/unknown
   * 1: Without adipose fin ("Fettfena" in Swedish)
   * 2: Has adipose fin
   */
  fin: string;
  /**
   * Gender enum
   * 0: Unclear/unknown
   * 1: Female
   * 2: Male
   */
  gen: string;
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
}

@Injectable()
export class ReportsProvider {
  constructor(
    private api: ApiProvider,
    private fish: FishProvider,
    private technique: TechniqueProvider,
    private bait: BaitProvider,
  ) {}
  getReports({ filter, orgId, items }: { filter?: 1; orgId?: number; items?: number } = {}): Observable<Report[]> {
    return this.api.getReports({ filter, orgId, items }).pipe(
      map(x => {
        return Object.values(x).map((report: Report & { day: number; c: number }) => {
          return {
            ...report,
            day: new Date(report.day * 1000),
            c: new Date(report.c * 1000),
            technique$: this.technique.getOne(report.tech),
            bait$: this.bait.getOne(report.bait),
            img1: report.img1 ? `${serverLocation}${report.img1}` : undefined,
            img2: report.img2 ? `${serverLocation}${report.img2}` : undefined,
            catches: report.catches.map(c => {
              return {
                ...c,
                fish$: this.fish.getOne(c.type),
              };
            }),
          };
        });
      }),
      share(),
    );
  }
}
