import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { Area } from '../../providers/area/area';
import { Organization } from '../../providers/organization/organization';
import { SuperTabsController } from 'ionic2-super-tabs';
import { Product } from '../../providers/product/product';
import { UserProvider } from '../../providers/user/user';
import { SessionProvider } from '../../providers/session/session';
import { TranslateToastController } from '../../providers/translate-toast-controller/translate-toast-controller';

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
    private tabsController: SuperTabsController,
    private sessionData: SessionProvider,
    private userProvider: UserProvider,
    private toastCtrl: TranslateToastController,
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

  async toggleFavorite() {
    if (this.sessionData.token) {
      const favorite = await this.userProvider.toggleFavorite(this.area);
      const message = favorite ? 'Area added to favorites' : 'Area removed from favorites';
      const toast = await this.toastCtrl.create({
        message,
        duration: 4000,
      });
      toast.present();
    } else {
      const toast = await this.toastCtrl.create({
        message: 'Login required for favorite',
        duration: 6000,
        dismissOnPageChange: true,
        showCloseButton: true,
        closeButtonText: 'Log in',
      });
      toast.present();
      toast.onDidDismiss((data, role) => {
        if (role === 'close') {
          // this.modalCtrl.create(LoginComponent).present();
        }
      })
    }
  }

  gotoPermits() {
    this.tabsController.slideTo('AreasDetailPermitPage', 'areas-details');
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
