import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AreaProvider, Area } from '../../providers/area/area';
import { FishProvider, Fish } from '../../providers/fish/fish';
import { County } from '../../providers/county/county';

function debounce(callback, delay) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback.apply(context, args);
    }, delay);
  };
};

/**
 * Generated class for the AreasSearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  segment: 'area-search/:ID',
  defaultHistory: ['HomePage'],
})
@Component({
  selector: 'page-areas-search',
  templateUrl: 'areas-search.html',
})
export class AreasSearchPage {
  county: County;
  searchTerm: string;
  areas: Area[] = [];
  foundFish: Fish;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private area: AreaProvider,
    private fish: FishProvider,
  ) { }

  ionViewWillEnter() {
    console.log(this.navParams);
    this.county = this.navParams.data.county;

    this.searchImmediate('');
  }

  searchImmediate(e: any) {
    const searchTerm: string = e.target ? e.target.value : e;
    if (searchTerm) {
      this.fish.search(searchTerm).then(fishes => {
        console.log(fishes);
        if (fishes.length) {
          this.foundFish = fishes[0].item;
        } else {
          this.foundFish = undefined;
        }
      });
    } else {
      this.foundFish = undefined;
    }
    return this.area.search(searchTerm, this.county.ID)
      .then(data => {
        this.areas = data;
        if (this.foundFish) {
          this.areas.forEach(area => {
            for (let i = 5; i >= 0; --i) {
              const fishes = area['fish_' + i];
              if (fishes && fishes.indexOf(this.foundFish.t) !== -1) {
                area.level = i;
                break;
              }
            }
          });
        }
        this.scrollTop();
      }, err => {
        console.log(err);
      });
  }

  search = debounce(this.searchImmediate, 500);

  keyPress($event) {
    if ($event.keyCode === 13) { // if enter-key
      $event.preventDefault();
      const searchTerm = $event.srcElement.value;
      this.searchImmediate(searchTerm);
      /*
      if (window.cordova) {
        $cordovaKeyboard.close();
      }
      */
    }
  }

  scrollTop() {
    /*
    $ionicScrollDelegate.scrollTop();
    */
  }

  goto(area: Area) {
    this.navCtrl.push('AreasDetailPage', area);
  }

}
