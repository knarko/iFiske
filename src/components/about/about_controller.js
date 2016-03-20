angular.module('ifiske.controllers')
.controller('AboutCtrl', [
    '$scope',
    '$cordovaAppVersion',
    '$ionicPlatform',
    '$ionicModal',
    'Update',
    'Licenses',
    'Push',
    function($scope, $cordovaAppVersion, $ionicPlatform, $ionicModal, Update, Licenses, Push) {
        $scope.version = $scope.dbDate = 'Okänt';
        $scope.update = Update;

        //Show the push token for debugging purposes
        $scope.push = Push;

        $ionicPlatform.ready(function() {
            if (window.cordova) {
                $cordovaAppVersion.getVersionNumber().then(function(version) {
                    console.log('iFiske version:', version);
                    $scope.version = version;
                });
                $cordovaAppVersion.getVersionCode().then(function(build) {
                    $scope.build = build;
                });
            }
            Licenses.get().then(function(data) {
                $scope.licenses = data.data;
            });
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
    }
]);
