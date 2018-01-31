import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Keyboard, Content } from 'ionic-angular';
import { AdminProvider, AdminOrganization, AdminPermit } from '../../providers/admin/admin';
import { Permit } from '../../providers/user/user';
import { debounce } from '../../util';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { switchMap, map, distinctUntilChanged } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';

const headers = {
  active:   { title: 'ui.permit.validity.plural.active',   icon: 'checkmark' },
  inactive: { title: 'ui.permit.validity.plural.inactive', icon: 'time' },
  expired:  { title: 'ui.permit.validity.plural.expired',  icon: 'close' },
  revoked:  { title: 'ui.permit.validity.plural.revoked',  icon: 'close' },
}

@IonicPage()
@Component({
  selector: 'page-admin-permit-list',
  templateUrl: 'admin-permit-list.html',
})
export class AdminPermitListPage {
  scrollSub: Subscription;
  shouldScrollToTop: boolean;
  currentOrganization: Observable<AdminOrganization>;
  searchSubject: ReplaySubject<string>;
  searchTerm: string;
  permits: Observable<AdminPermit[]>;
  scrollSubject: Subject<void>;

  private sub: Subscription;

  @ViewChild(Content) content: Content;

  constructor(
    private navCtrl: NavController,
    private adminProvider: AdminProvider,
    private navParams: NavParams,
    private keyboard: Keyboard,
  ) {
    this.searchSubject = new ReplaySubject<string>(1);
    this.permits = this.searchSubject.pipe(
      distinctUntilChanged(),
      switchMap(searchTerm => this.adminProvider.search(searchTerm)),
      map((permits: AdminPermit[])=> {
        return permits.sort((a, b) => a.validity.localeCompare(b.validity));
      }),
    );
    this.scrollSubject = new Subject();
    this.scrollSub = this.permits.subscribe(() => {
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

  isNewValidity (record: AdminPermit, recordIndex: number, records: AdminPermit[]) {
    if (records[recordIndex - 1] && records[recordIndex -1].validity === record.validity) {
      return null;
    } else {
      headers[record.validity].count = records.filter(val => val.validity === record.validity).length;
      return headers[record.validity];
    }
  };

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

  search = debounce(this.searchImmediate, 500)

  keypress($event: KeyboardEvent) {
    if ($event.keyCode === 13) { // if enter-key
      $event.preventDefault();
      const searchTerm = ($event.srcElement as HTMLInputElement).value;
      this.searchImmediate(searchTerm);
      this.keyboard.close();
    }
  }
}
