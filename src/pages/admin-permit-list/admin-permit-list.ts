import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, Keyboard, Content } from 'ionic-angular';
import { AdminProvider } from '../../providers/admin/admin';
import { Permit } from '../../providers/user/user';
import { debounce } from '../../util';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-admin-permit-list',
  templateUrl: 'admin-permit-list.html',
})
export class AdminPermitListPage {
  searchSubject: ReplaySubject<string>;
  searchTerm: string;
  permits: Observable<Permit[]>;
  @ViewChild(Navbar) navbar: Navbar;
  @ViewChild(Content) content: Content;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private adminProvider: AdminProvider,
    private keyboard: Keyboard,
  ) {
    this.searchSubject = new ReplaySubject<string>(1);
    this.permits = this.searchSubject.pipe(
      switchMap(searchTerm => this.adminProvider.search(searchTerm)),
    );
    this.permits.subscribe(() => {
      this.content.scrollToTop();
    });
  }

  ionViewWillLoad() {
    this.navbar.backButtonClick = () => {
      this.navCtrl.parent.viewCtrl.dismiss();
    }
  }

  ionViewWillLeave() {
    this.navParams.data.searchTerm = this.searchTerm;
  }

  ionViewWillEnter() {
    this.searchTerm = this.navParams.get('searchTerm') || '';

    this.searchSubject.next(this.searchTerm);
  }

  pickOrganization() {
    this.adminProvider.pickOrganization();
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
