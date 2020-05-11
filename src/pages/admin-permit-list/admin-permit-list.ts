import { Component, ViewChild, OnDestroy } from '@angular/core';

import {
  IonicPage,
  NavController,
  NavParams,
  Keyboard,
  Content,
  Refresher,
  Loading,
  ModalController,
} from 'ionic-angular';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import {
  switchMap,
  map,
  distinctUntilChanged,
  shareReplay,
  take,
} from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import debounce from 'lodash/debounce';

import { AdminProvider } from '../../providers/admin/admin';
import {
  AdminOrganization,
  AdminPermit,
  AdminPermitSearchResult,
} from '../../providers/admin/adminTypes';
import { Permit } from '../../providers/user/userTypes';
import { TranslateLoadingController } from '../../providers/translate-loading-controller/translate-loading-controller';
import { MonitoringClient } from '../../app/monitoring';
import { TimeoutError } from '../../errors';
import { TranslateToastController } from '../../providers/translate-toast-controller/translate-toast-controller';
import { FilterModalComponent } from '../../components/filter-modal/filter-modal';
import { takeUntil } from 'rxjs/operators';

export interface DisplayPermit {
  key: string;
  title: string;
  permits: AdminPermitSearchResult[];
  icon: string;
  folded?: boolean;
}

@IonicPage()
@Component({
  selector: 'page-admin-permit-list',
  templateUrl: 'admin-permit-list.html',
})
export class AdminPermitListPage implements OnDestroy {
  pristinePermits: AdminPermitSearchResult[];
  scrollSub: Subscription;
  shouldScrollToTop: boolean;
  currentOrganization: Observable<AdminOrganization>;
  searchSubject: ReplaySubject<string>;
  searchTerm: string;
  permits$: Observable<AdminPermit[]>;
  scrollSubject: Subject<void>;
  hasResults: boolean;

  permits: DisplayPermit[] = [
    {
      key: 'active',
      title: 'ui.permit.validity.plural.active',
      permits: [],
      icon: 'ifiske-permit',
      folded: false,
    },
    {
      key: 'inactive',
      title: 'ui.permit.validity.plural.inactive',
      permits: [],
      icon: 'time',
      folded: true,
    },
    {
      key: 'expired',
      title: 'ui.permit.validity.plural.expired',
      permits: [],
      icon: 'close-circle',
      folded: true,
    },
    {
      key: 'revoked',
      title: 'ui.permit.validity.plural.revoked',
      permits: [],
      icon: 'close-circle',
      folded: true,
    },
  ];

  private permitTitles: string[];
  private filteredTitles$ = new BehaviorSubject<Record<string, boolean>>({});
  numberOfFilteredTitles$ = this.filteredTitles$.pipe(
    map((t) => Object.values(t).filter((v) => v === false).length),
  );

  private scrollSubscription: Subscription;
  private destroyed$ = new Subject<void>();
  private allFilteredPermitTitles: Record<string, Record<string, boolean>> = {};

  @ViewChild(Content)
  content: Content;

  constructor(
    private navCtrl: NavController,
    public adminProvider: AdminProvider,
    private navParams: NavParams,
    private keyboard: Keyboard,
    private loadingCtrl: TranslateLoadingController,
    private toastCtrl: TranslateToastController,
    private modalCtrl: ModalController,
  ) {
    this.currentOrganization = this.adminProvider.currentOrganization;

    this.setupFiltering();
    this.searchSubject = new ReplaySubject<string>(1);

    const search$ = this.searchSubject.pipe(
      distinctUntilChanged(),
      switchMap((searchTerm) => this.adminProvider.search(searchTerm)),
    );

    this.permits$ = combineLatest(search$, this.filteredTitles$).pipe(
      map(([permits, filteredTitles]) => {
        const permitTitlesSet = new Set<string>();

        const sortedPermits = permits
          .filter((permit) => {
            permitTitlesSet.add(permit.t);
            return filteredTitles[permit.t] !== false;
          })
          .sort((a, b) => {
            return (
              a.score - b.score || // Best matching search terms
              b.at - a.at || // Most recently issued
              a.fullname.localeCompare(b.fullname, 'sv')
            );
          });

        this.permitTitles = Array.from(permitTitlesSet).sort();

        return sortedPermits;
      }),
      shareReplay(1),
    );
    this.scrollSubject = new Subject();
    this.scrollSub = this.permits$.subscribe((permits) => {
      this.pristinePermits = permits;
      this.updatePermits();
      if (!this.scrollSubject.observers.length) {
        this.shouldScrollToTop = true;
      }
      this.scrollSubject.next();
    });
  }

  ngOnDestroy() {
    this.destroyed$.next();
  }

  ionViewWillUnload() {
    this.searchSubject.complete();
    this.scrollSubject.complete();
    this.scrollSub.unsubscribe();
  }

  private setupFiltering() {
    try {
      const savedFilters = JSON.parse(
        localStorage.getItem('AllAdminFilteredPermitTitles'),
      );
      if (savedFilters) {
        this.allFilteredPermitTitles = savedFilters;
      }
    } catch (err) {}

    let currentOrganization: number;
    this.adminProvider.currentOrganization
      .pipe(takeUntil(this.destroyed$))
      .subscribe((org) => {
        currentOrganization = org.ID;
        this.filteredTitles$.next(this.allFilteredPermitTitles[org.ID] || {});
      });

    this.filteredTitles$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((titles) => {
        this.allFilteredPermitTitles[currentOrganization] = titles;
        localStorage.setItem(
          'AllAdminFilteredPermitTitles',
          JSON.stringify(this.allFilteredPermitTitles),
        );
      });
  }

  private updatePermits() {
    this.permits.forEach((p) => {
      p.permits = [];
    });

    this.hasResults = this.pristinePermits.some((permit) => !!permit.matches);
    this.pristinePermits.forEach((permit) => {
      this.permits
        .find((item) => item.key === permit.validity)
        .permits.push(permit);
    });
  }

  fold(displayPermit: DisplayPermit) {
    displayPermit.folded = !displayPermit.folded;
  }

  permitTrackFn(_index: number, item: AdminPermit) {
    return item.ID;
  }

  back() {
    this.ionViewWillLeave();
  }

  ionViewWillLeave() {
    this.navParams.data.searchTerm = this.searchTerm;
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
      this.scrollSubscription = undefined;
    }
  }

  ionViewDidEnter() {
    if (this.shouldScrollToTop) {
      this.refresh();
      this.shouldScrollToTop = false;
      this.scrollSubject.next();
    }
  }

  ionViewWillEnter() {
    this.scrollSubscription = this.scrollSubject
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        try {
          this.content.scrollToTop();
        } catch (err) {
          this.scrollSubscription.unsubscribe();
          this.scrollSubscription = undefined;
        }
      });

    this.searchTerm = this.navParams.get('searchTerm') || '';

    this.searchSubject.next(this.searchTerm);
  }

  goto(permit: Permit) {
    this.navCtrl.push('AdminPermitPage', permit);
  }

  async searchImmediate(e: any) {
    const searchTerm: string = e.target ? e.target.value : e;
    this.searchSubject.next(searchTerm);
  }

  search = debounce(this.searchImmediate, 500);

  keypress($event: KeyboardEvent) {
    if ($event.keyCode === 13) {
      // if enter-key
      $event.preventDefault();
      const searchTerm = ($event.srcElement as HTMLInputElement).value;
      this.searchImmediate(searchTerm);
      this.keyboard.close();
    }
  }

  async refresh(refresher?: Refresher) {
    let loading: Promise<Loading>;
    try {
      if (!refresher) {
        loading = this.loadingCtrl.show({ content: 'Updating' });
      }
      const updated = await this.adminProvider.update();
      if (!updated) {
        throw new TimeoutError(`Could not update admin`);
      }
      // Wait for this before removing the spinner
      await this.permits$.pipe(take(1)).toPromise();
    } catch (error) {
      console.warn(error);
      if (error.name === TimeoutError.name) {
        this.toastCtrl.show({
          message: 'errors.network',
          duration: 4000,
        });
      } else {
        MonitoringClient.captureException(error);
      }
    } finally {
      if (refresher) {
        refresher.complete();
      } else {
        (await loading).dismiss();
      }
    }
  }

  async openFilterModal() {
    const filteredTitles = { ...this.filteredTitles$.value };

    // Remove any permit titles that no longer exist in the list of titles
    Object.keys(filteredTitles).forEach((key) => {
      if (this.permitTitles.indexOf(key) === -1) {
        delete filteredTitles[key];
      }
    });

    // Set the default values
    this.permitTitles.forEach((title) => {
      if (filteredTitles[title] == undefined) {
        filteredTitles[title] = true;
      }
    });

    const modalRef = this.modalCtrl.create(FilterModalComponent, {
      header: 'ui.admin.filter.instructions',
      values: this.permitTitles,
      selectedValues: filteredTitles,
    });
    modalRef.present();
    modalRef.onWillDismiss((result) => {
      this.filteredTitles$.next(result);
    });
  }
}
