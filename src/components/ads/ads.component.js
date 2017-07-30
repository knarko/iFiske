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
      ) {
        AdService.main().then(ads => {
          this.ads = ads;
          this.options = {
            loop:                         true,
            autoplay:                     5000,
            autoplayDisableOnInteraction: false,
            spaceBetween:                 100,
          };
        });
        $scope.openInBrowser = function(ad) {
          analytics.trackEvent('Ads', 'clicked', ad.ID);
          $cordovaInAppBrowser.open(ad.URL, '_system');
        };
      }
    },
  });
