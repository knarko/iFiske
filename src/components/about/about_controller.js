angular.module('ifiske.controllers')
.controller('AboutCtrl', [
    '$scope',
    '$cordovaAppVersion',
    '$ionicPlatform',
    '$ionicModal',
    'Update',
    'Licenses',
    function($scope, $cordovaAppVersion, $ionicPlatform, $ionicModal, Update, Licenses) {
        $scope.version = $scope.dbDate = 'Okänt';
        $scope.update = Update;

        $ionicPlatform.ready(function() {
            if (window.cordova) {
                $cordovaAppVersion.getAppVersion().then(function(version) {
                    console.log('iFiske version:', version);
                    $scope.version = version;
                });
            }
            Licenses.get().then(function(data) {
                $scope.licenses = data;
                $scope.alert = function(l) {
                    var scope = $scope.$new();
                    scope.l = l;
                    $ionicModal.fromTemplateUrl(
                        'components/about/license_modal.html',
                        {scope: scope}
                    ).then(function(modal) {
                        scope.closeModal = function() {
                            modal.hide();
                        };
                        modal.show();
                    });

                };

            });
        });
    }
]);
