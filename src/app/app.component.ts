import { Component } from '@angular/core';
import { Platform, Config, App, ViewController, ToolbarTitle } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UpdateProvider } from '../providers/update/update';
import { MDTransition } from 'ionic-page-transitions';
import { TranslateService } from '@ngx-translate/core';
import { SettingsProvider } from '../providers/settings/settings';
import { PushProvider } from '../providers/push/push';
import { DeployProvider } from '../providers/deploy/deploy';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { IonicPro } from './pro';
import { publishReplay } from 'rxjs/operators/publishReplay';

@Component({
  templateUrl: 'app.html',
})
export class MyApp {
  rootPage: any = 'HomePage';

  constructor(
    private app: App,
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
    this.deploy.initialize().catch(err => {
      console.warn(err);
      IonicPro.monitoring.handleNewError(err);
    });
    platform.ready().then(async () => {
      this.push.initialize();
      if (true || localStorage.getItem('language')) {
        this.update.update().catch(e => console.warn(e));
      }
      const backButtonText = translate.stream('ui.general.back').pipe(
        publishReplay(1),
      );

      this.config.set('ios', 'backButtonText', await backButtonText.pipe(take(1)).toPromise());
      if (platform.is('ios')) {
        const subs = new Map<ViewController, Subscription>();

        this.app.viewWillLeave.subscribe(view => {
          if (subs.has(view)) {
            subs.get(view).unsubscribe()
            subs.delete(view);
          }
        });

        this.app.viewWillEnter.subscribe((view: ViewController) => {
          const sub = backButtonText.subscribe(backButtonText => {
            // Bug with width of back button on ios
            //const previousViewTitle = this.getPreviousViewTitle(view);
            //view.setBackButtonText(previousViewTitle || backButtonText);
            view.setBackButtonText(backButtonText);
          });

          if (subs.has(view)) {
            subs.get(view).unsubscribe();
          }
          subs.set(view, sub);
        });
      }
    });
  }
  getPreviousViewTitle(view: ViewController) {
      const previousView = view.getNav().getPrevious(view);
      if (!previousView) {
        return '';
      }
      const previousNavbar = previousView.getNavbar() as any;
      if (!previousNavbar) {
        return '';
      }
      const titleText = (previousNavbar as ToolbarTitle).getTitleText() || '';
      return titleText.trim();
  }

  ionViewDidEnter() {
    this.platform.ready().then(() => {
      this.statusBar.styleBlackTranslucent();
      this.splashScreen.hide();
    });
  }
}

