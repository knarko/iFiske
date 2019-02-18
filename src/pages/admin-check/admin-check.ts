import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { serverLocation } from '../../providers/api/serverLocation';
import { TranslateToastController } from '../../providers/translate-toast-controller/translate-toast-controller';
import { MonitoringClient } from '../../app/monitoring';

@IonicPage()
@Component({
  selector: 'page-admin-check',
  templateUrl: 'admin-check.html',
})
export class AdminCheckPage {
  permitCode: string;
  serverLocation = serverLocation;

  constructor(
    private navCtrl: NavController,
    private barcodeScanner: BarcodeScanner,
    private toastCtrl: TranslateToastController,
  ) {}

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
        return;
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
      this.navCtrl.push('AdminPermitPage', { code });
    } catch (err) {
      console.error(err);

      MonitoringClient.captureException(err);

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
