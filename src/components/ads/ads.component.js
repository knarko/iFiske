angular.module('ifiske.controllers')
  .component('ads', {
    templateUrl:  'components/ads/ads.component.html',
    controllerAs: 'vm',
    controller:   class AdsController {
      constructor(
        AdService,
        $cordovaInAppBrowser,
        analytics,
        $scope,
        $timeout,
      ) {
        $scope.$on('$ionicSlides.sliderInitialized', (_event, data) => {
          // grab an instance of the slider
          this.slider = data.slider;
        });
        this.options = {
          effect:                       'slide',
          speed:                        300,
          loop:                         true,
          autoplay:                     5000,
          autoplayDisableOnInteraction: false,
          preloadImages:                true,
          pagination:                   undefined,
        };
        AdService.main().then(ads => {
          this.ads = ads;
          if (this.slider) {
            $timeout(() => {
              this.slider.update();
              this.slider.slideTo(1);
              this.slider.startAutoplay();
            }, 10);
          }
        });
        $scope.openInBrowser = function(ad) {
          analytics.trackEvent('Ads', 'clicked', ad.ID);
          $cordovaInAppBrowser.open(ad.URL, '_system');
        };
      }
    },
  });
