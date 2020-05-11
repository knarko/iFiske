import { Component, ViewChild } from '@angular/core';
import {
  Platform,
  Config,
  App,
  ViewController,
  ToolbarTitle,
  NavController,
} from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UpdateProvider } from '../providers/update/update';
import { MDTransition } from 'ionic-page-transitions';
import { TranslateService } from '@ngx-translate/core';
import { SettingsProvider } from '../providers/settings/settings';
import { DeployProvider, Connection } from '../providers/deploy/deploy';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { UserTrackingProvider } from '../providers/user-tracking/user-tracking';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';
import { PushProvider } from '../providers/push/push';

@Component({
  templateUrl: 'app.html',
})
export class MyApp {
  offline: boolean;
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
    private deploy: DeployProvider,
    private network: Network,
    private analytics: FirebaseAnalytics,
    private userTracking: UserTrackingProvider,
    // Need to import this so that it initializes
    private push: PushProvider,
  ) {
    console.log(this.push);
    if (this.settings.firstLaunch) {
      this.rootPage = 'OnboardingPage';
    }
    this.config.setTransition('md-transition', MDTransition);
    this.translate.setDefaultLang('sv');
    this.translate.use(this.settings.language);
    this.deploy.initialize().catch((err) => {
      console.warn(err);
    });

    this.update
      .update(false, this.settings.firstLaunch)
      .catch((e) => console.warn(e))
      .then(() => {
        this.userTracking.track('appOpened');
      });
    platform.ready().then(() => {
      this.setupBackButtonText();

      this.setupAnalytics();

      /* enable this code in order to show/hide the offline notification
      this.setOffline();
      this.network.onchange().subscribe(type => {
        this.setOffline();
      });
      */
    });
  }

  async setupBackButtonText() {
    const backButtonText = this.translate.stream('ui.general.back');

    this.config.set(
      'ios',
      'backButtonText',
      await backButtonText.pipe(take(1)).toPromise(),
    );
    if (this.platform.is('ios')) {
      const subs = new Map<ViewController, Subscription>();

      this.app.viewWillLeave.subscribe((view) => {
        if (subs.has(view)) {
          subs.get(view).unsubscribe();
          subs.delete(view);
        }
      });

      this.app.viewWillEnter.subscribe((view: ViewController) => {
        const sub = backButtonText.subscribe((backButtonText) => {
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
  }

  setupAnalytics() {
    this.app.viewWillEnter.subscribe((view: ViewController) => {
      this.analytics.setCurrentScreen(view.id);
    });
  }

  setOffline() {
    this.offline = false;
    switch (this.network.type) {
      case Connection.NONE:
      case Connection.UNKNOWN:
        this.offline = true;
        break;
    }
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

  @ViewChild('myNav')
  nav: NavController;

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');

    const timeout = setTimeout(() => {
      console.log('8s fallback timeout');
      this.statusBar.styleBlackTranslucent();
      this.splashScreen.hide();
    }, 8000);

    const sub = this.nav.viewDidLoad.pipe(take(1)).subscribe(() => {
      console.log('nav.viewDidLoad');
      clearTimeout(timeout);
      this.statusBar.styleBlackTranslucent();
      this.splashScreen.hide();
    });

    this.platform.ready().then(() => {
      console.log('ngAfterViewInit: plt ready');
      clearTimeout(timeout);
      if (sub) {
        sub.unsubscribe();
      }
      this.statusBar.styleBlackTranslucent();
      this.splashScreen.hide();
    });
  }
}
