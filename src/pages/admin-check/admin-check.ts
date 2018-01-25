import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { serverLocation } from '../../providers/api/serverLocation';
import { TranslateToastController } from '../../providers/translate-toast-controller/translate-toast-controller';
import { AdminProvider } from '../../providers/admin/admin';

@IonicPage()
@Component({
  selector: 'page-admin-check',
  templateUrl: 'admin-check.html',
})
export class AdminCheckPage {
  @ViewChild(Navbar) navbar: Navbar;

  permitCode: string;
  serverLocation = serverLocation;


  constructor(
    public navParams: NavParams,
    private barcodeScanner: BarcodeScanner,
    private toastCtrl: TranslateToastController,
    private navCtrl: NavController,
    private adminProvider: AdminProvider,
  ) { }

  pickOrganization() {
    this.adminProvider.pickOrganization();
  }

  ionViewWillLoad() {
    this.navbar.backButtonClick = () => {
      this.navCtrl.parent.viewCtrl.dismiss();
    }
  }

  checkPermit() {
    this.navCtrl.push('AdminPermitPage', { code: this.permitCode });
  }

  async scanQR() {
    try {
      const res = await this.barcodeScanner.scan({
        orientation: 'portrait',
        resultDisplayDuration: 0,
        formats: 'QR_CODE',
      });
      if (res.cancelled) {
        throw new Error('Cancelled');
      }
      if (res.format !== 'QR_CODE') {
        throw new Error('invalid');
      }
      const url = new URL(res.text);
      const searchParams = new URLSearchParams(url.search);
      if (!searchParams.has('e')) {
        throw new Error('invalid');
      }
      const code = searchParams.get('e');
      console.log('Scanned: ', code);
      this.navCtrl.push('AdminPermitPage', { code })
    } catch (err) {
      console.error(err);

      // TODO: Raven
      // Raven.captureException(err);

      switch (err.message) {
        case 'invalid':
        default:
          this.toastCtrl.show({
            message: 'errors.admin.scanQR.invalid',
            duration: 6000,
          });
      }
    }
  }

}
