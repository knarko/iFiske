import { Component, ViewChild, EventEmitter, Output } from '@angular/core';
import { NavController, Navbar } from 'ionic-angular';

import { AdminProvider } from '../../providers/admin/admin';

@Component({
  selector: 'admin-header',
  templateUrl: 'admin-header.html',
})
export class AdminHeaderComponent {
  @ViewChild(Navbar) private _navbar: Navbar;
  @Output() back = new EventEmitter<void>();

  constructor(public admin: AdminProvider, private navCtrl: NavController) {}

  ngAfterViewInit() {
    this._navbar.backButtonClick = () => {
      this.navCtrl.parent.viewCtrl.dismiss();
      this.back.emit();
    };
  }
}
