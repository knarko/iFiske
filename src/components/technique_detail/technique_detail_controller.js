angular.module('ifiske.controllers')
.controller('TechniqueDetailCtrl', function($scope, $stateParams, Technique) {
    $scope.tech = $stateParams.tech;
    $scope.images = [];

    $scope.slideOptions = {
        loop:       true,
        effect:     'slide',
        speed:      250,
        autoPlay:   1000,
        autoHeight: true,
    };

    $scope.$on("$ionicSlides.sliderInitialized", function(_event, data) {
        // grab an instance of the slider
        $scope.slider = data.slider;
        $scope.slider.updateLoop();
    });

    if ($scope.tech) {
        var data = $scope.tech;
        $scope.images = [data.img1, data.img2, data.img3].filter(function(el) {
            return !/\/$/.test(el);
        });
        if ($scope.slider) {
            $scope.slider.updateLoop();
        }
    } else {
        Technique.getOne($stateParams.id)
        .then(function(data) {
            $scope.images = [data.img1, data.img2, data.img3].filter(function(el) {
                return !/\/$/.test(el);
            });
            if ($scope.slider) {
                $scope.slider.updateLoop();
            }

            $scope.tech = data;
        });
    }
});
