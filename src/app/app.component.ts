import { Component } from '@angular/core';
import { Platform, Config } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UpdateProvider } from '../providers/update/update';
import { MDTransition } from 'ionic-page-transitions';
import { TranslateService } from '@ngx-translate/core';
import { SettingsProvider } from '../providers/settings/settings';
import { PushProvider } from '../providers/push/push';
import { DeployProvider } from '../providers/deploy/deploy';

@Component({
  templateUrl: 'app.html',
})
export class MyApp {
  rootPage: any = 'HomePage';

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private update: UpdateProvider,
    private config: Config,
    private translate: TranslateService,
    private settings: SettingsProvider,
    private push: PushProvider,
    private deploy: DeployProvider,
  ) {
    this.config.setTransition('md-transition', MDTransition);
    this.translate.setDefaultLang('sv');
    this.translate.use(this.settings.language);
    this.deploy.initialize();
    platform.ready().then(async () => {
      this.push.initialize();
      if (true || localStorage.getItem('language')) {
        this.update.update().catch(e => console.warn(e));
      }
      this.config.set('ios', 'backButtonText', await translate.get('ui.general.back').toPromise());
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.statusBar.styleBlackTranslucent();
    });
  }

  ionViewDidEnter() {
    this.platform.ready().then(() => {
      this.splashScreen.hide();
    });
  }
}

