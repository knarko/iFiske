import { Component } from '@angular/core';
import { Platform, Config } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UpdateProvider } from '../providers/update/update';
import { MDTransition } from 'ionic-page-transitions';

@Component({
  templateUrl: 'app.html',
})
export class MyApp {
  rootPage:any = 'HomePage';

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, update: UpdateProvider, config: Config) {
    config.setTransition('md-transition', MDTransition);
    platform.ready().then(() => {
        if (true || localStorage.getItem('language')) {
          update.update();
        }
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

