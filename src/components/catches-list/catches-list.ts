import { Component, Input } from '@angular/core';
import { Catch } from '../../providers/reports/reports';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'catches-list',
  templateUrl: './catches-list.html',
})
export class CatchesListComponent {
  @Input() catches: Catch[];
  constructor(private navCtrl: NavController) {}

  openFish(catched: Catch) {
    this.navCtrl.push('SpeciesDetailPage', { ID: catched.type });
  }
}
