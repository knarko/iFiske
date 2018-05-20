import { Component, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { NavController, Navbar } from 'ionic-angular';

@Component({
  selector: 'tab-navbar',
  templateUrl: 'tab-navbar.html',
})
export class TabNavbarComponent {
  @ViewChild(Navbar) private _navbar: Navbar;
  @Output() back = new EventEmitter<void>();
  @Input() largeTitle: boolean = false;

  constructor(private navCtrl: NavController) {}

  ngAfterViewInit() {
    this._navbar.backButtonClick = () => {
      this.navCtrl.parent.viewCtrl.dismiss();
      this.back.emit();
    };
  }
}
