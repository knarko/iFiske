import { Component, Input } from '@angular/core';
import { AdminPermit } from '../../providers/admin/adminTypes';
import { AdminProvider } from '../../providers/admin/admin';
import { TranslateLoadingController } from '../../providers/translate-loading-controller/translate-loading-controller';

@Component({
  selector: 'app-permit-log',
  templateUrl: 'permit-log.html',
})
export class PermitLogComponent {
  @Input() permit: AdminPermit;

  logText = '';
  constructor(
    private admin: AdminProvider,
    private loadingCtrl: TranslateLoadingController,
  ) {}

  async checkLog() {
    const loading = await this.loadingCtrl.show({ content: 'Loading' });
    try {
      await this.admin.checkLog('' + this.permit.code);
    } finally {
      loading.dismiss();
    }
  }
  async addLog() {
    const loading = await this.loadingCtrl.show({ content: 'Loading' });
    try {
      await this.admin.addLog('' + this.permit.code, this.logText);
      this.logText = '';
    } finally {
      loading.dismiss();
    }
  }
}
