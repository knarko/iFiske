import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { Area, AreaProvider } from '../../providers/area/area';
import { Organization } from '../../providers/organization/organization';
import { SuperTabsController } from 'ionic2-super-tabs';
import { Product } from '../../providers/product/product';

/**
 * Generated class for the AreasDetailInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-areas-detail-info',
  templateUrl: 'areas-detail-info.html',
})
export class AreasDetailInfoPage {
  products: Product[];
  area: Area;
  org: Organization;
  images: any[];
  files: any[];

  private slides: Slides;

  @ViewChild('slides') set slidesSetter(slides: Slides) {
    if (!this.slides && slides) {
      this.slides = slides;
      this.initSlides();
    }
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private areaProvider: AreaProvider,
    private tabsController: SuperTabsController,
  ) {
    this.navParams.get('params').subscribe(({ area, org, products }) => {
      this.area = area;
      this.org = org;
      this.products = products;
      if (this.area) {
        this.area.images.then(images => this.images = images);
      }
    });
  }
  gotoLicenses() {
    this.tabsController.slideTo('AreasDetailLicensePage', 'areas-details');
  }

  imageLoaded(i: number) {
    if (i === 0)
      this.slides.update();
  }

  initSlides() {
    this.slides.autoHeight = true;
    //this.slides.autoplay = 4000;
    //this.slides.loop = true;
    //(this as any).slides.updateOnImagesReady = true;
    console.log(this.slides);
    /*
    this.slides('onImagesReady', () => {
      console.log('images ready');
      this.slides.update();
    });
    */
  }
}
