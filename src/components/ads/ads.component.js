angular.module('ifiske.controllers')
    .component('ads', {
        templateUrl:  'components/ads/ads.component.html',
        controllerAs: 'vm',
        controller:   class AdsController {
            constructor(
                AdService,
                $scope
            ) {
                $scope.$on("$ionicSlides.sliderInitialized", (_event, data) => {
                    // grab an instance of the slider
                    this.slider = data.slider;
                    console.log(this.slider);
                });
                this.options = {
                    effect:                       'slide',
                    speed:                        250,
                    loop:                         true,
                    autoplay:                     5000,
                    autoplayDisableOnInteraction: false,
                    initialSlide:                 1, // Needs to be one since we add duplicates when looping
                    pagination:                   undefined,
                };
                AdService.main().then(ads => {
                    console.log(ads);
                    this.ads = ads;
                    if (this.slider) {
                        this.slider.updateLoop();
                        this.slider.slideTo(1);
                    }
                });
            }
        },
    });
