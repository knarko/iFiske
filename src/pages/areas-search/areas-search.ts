import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Keyboard, Content } from 'ionic-angular';
import { AreaProvider, Area } from '../../providers/area/area';
import { FishProvider, Fish } from '../../providers/fish/fish';
import { County } from '../../providers/county/county';
import { debounce } from '../../util';

@IonicPage({
  segment: 'area-search/:ID',
  defaultHistory: ['HomePage'],
})
@Component({
  selector: 'page-areas-search',
  templateUrl: 'areas-search.html',
})
export class AreasSearchPage {
  county?: County;
  searchTerm: string;
  areas: Area[];
  foundFish: Fish;

  @ViewChild(Content) content: Content;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private area: AreaProvider,
    private fish: FishProvider,
    private keyboard: Keyboard,
  ) { }

  ionViewDidLoad() {
    this.county = this.navParams.get('county');
    this.searchTerm = this.navParams.get('searchTerm') || '';

    this.searchImmediate(this.searchTerm);
  }

  scrollHeaders = (_area: Area, index: number) => {
    if (index === 0 && this.foundFish) {
      return this.foundFish;
    }
    return null;
  };

  trackFn = (index: number, area: Area) => {
    return area.ID;
  };

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
    return this.area.search(searchTerm, this.county && this.county.ID)
      .then(data => {
        this.areas = data.slice();
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
        this.content.scrollToTop();
      }, err => {
        console.log(err);
      });
  }

  search = debounce(this.searchImmediate, 500);

  keypress($event) {
    if ($event.keyCode === 13) { // if enter-key
      $event.preventDefault();
      const searchTerm = $event.srcElement.value;
      this.searchImmediate(searchTerm);
      this.keyboard.close();
    }
  }

  goto(area: Area) {
    this.navCtrl.push('AreasDetailPage', area);
  }

}
