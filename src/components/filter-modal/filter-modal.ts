import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
  selector: 'filter-modal',
  templateUrl: 'filter-modal.html',
})
export class FilterModalComponent {
  values: string[];
  header: string;
  selectedValues: { [key: string]: boolean };
  constructor(private viewCtrl: ViewController, private navParams: NavParams) {
    this.values = this.navParams.get('values');
    this.selectedValues = this.navParams.get('selectedValues');
    this.header = this.navParams.get('header');
  }

  close() {
    return this.viewCtrl.dismiss(this.selectedValues);
  }
}
