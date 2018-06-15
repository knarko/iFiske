import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Keyboard, Content, Refresher, Loading } from 'ionic-angular';
import { AdminProvider, AdminOrganization, AdminPermit } from '../../providers/admin/admin';
import { Permit } from '../../providers/user/user';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { switchMap, map, distinctUntilChanged, shareReplay, take } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import debounce from 'lodash/debounce';
import { TranslateLoadingController } from '../../providers/translate-loading-controller/translate-loading-controller';
import { MonitoringClient } from '../../app/monitoring';
import { TimeoutError } from '../../errors';
import { TranslateToastController } from '../../providers/translate-toast-controller/translate-toast-controller';

export interface DisplayPermit {
  key: string;
  title: string;
  permits: AdminPermit[];
  icon: string;
  folded?: boolean;
}

@IonicPage()
@Component({
  selector: 'page-admin-permit-list',
  templateUrl: 'admin-permit-list.html',
})
export class AdminPermitListPage {
  pristinePermits: AdminPermit[];
  scrollSub: Subscription;
  shouldScrollToTop: boolean;
  currentOrganization: Observable<AdminOrganization>;
  searchSubject: ReplaySubject<string>;
  searchTerm: string;
  permits$: Observable<AdminPermit[]>;
  scrollSubject: Subject<void>;

  permits: DisplayPermit[] = [
    { key: 'active', title: 'ui.permit.validity.plural.active', permits: [], icon: 'ifiske-permit', folded: false },
    { key: 'inactive', title: 'ui.permit.validity.plural.inactive', permits: [], icon: 'time', folded: true },
    { key: 'expired', title: 'ui.permit.validity.plural.expired', permits: [], icon: 'close-circle', folded: true },
    { key: 'revoked', title: 'ui.permit.validity.plural.revoked', permits: [], icon: 'close-circle', folded: true },
  ];

  private sub: Subscription;

  @ViewChild(Content) content: Content;

  constructor(
    private navCtrl: NavController,
    public adminProvider: AdminProvider,
    private navParams: NavParams,
    private keyboard: Keyboard,
    private loadingCtrl: TranslateLoadingController,
    private toastCtrl: TranslateToastController,
  ) {
    this.searchSubject = new ReplaySubject<string>(1);
    this.permits$ = this.searchSubject.pipe(
      distinctUntilChanged(),
      switchMap(searchTerm => this.adminProvider.search(searchTerm)),
      map(permits => {
        return permits.sort((a, b) => {
          return (
            a.score - b.score || // Best matching search terms
            b.at - a.at || // Most recently issued
            a.fullname.localeCompare(b.fullname, 'sv')
          );
        });
      }),
      shareReplay(1),
    );
    this.scrollSubject = new Subject();
    this.scrollSub = this.permits$.subscribe(permits => {
      this.pristinePermits = permits;
      this.updatePermits();
      if (!this.scrollSubject.observers.length) {
        this.shouldScrollToTop = true;
      }
      this.scrollSubject.next();
    });
  }

  ionViewWillUnload() {
    this.searchSubject.complete();
    this.scrollSubject.complete();
    this.scrollSub.unsubscribe();
  }

  private updatePermits() {
    this.permits.forEach(p => {
      p.permits = [];
    });

    this.pristinePermits.forEach(permit => {
      this.permits.find(item => item.key === permit.validity).permits.push(permit);
    });
  }

  fold(displayPermit: DisplayPermit) {
    displayPermit.folded = !displayPermit.folded;
  }

  permitTrackFn(index: number, item: AdminPermit) {
    return item.ID;
  }

  back() {
    this.ionViewWillLeave();
  }

  ionViewWillLeave() {
    this.navParams.data.searchTerm = this.searchTerm;
    if (this.sub) {
      this.sub.unsubscribe();
      this.sub = undefined;
    }
  }

  ionViewDidEnter() {
    this.refresh();
    if (this.shouldScrollToTop) {
      this.shouldScrollToTop = false;
      this.scrollSubject.next();
    }
  }

  ionViewWillEnter() {
    this.sub = this.scrollSubject.subscribe(() => {
      try {
        this.content.scrollToTop();
      } catch (err) {
        this.sub.unsubscribe();
        this.sub = undefined;
      }
    });
    this.currentOrganization = this.adminProvider.currentOrganization;

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
}
