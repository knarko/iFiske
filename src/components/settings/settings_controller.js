angular.module('ifiske.controllers')
.controller('SettingsCtrl', function(
    $scope,
    $cordovaToast,
    $cordovaAppVersion,
    $ionicPlatform,
    $ionicModal,
    Push,
    Settings,
    Update,
    $translate
) {
    function afterPushResetSuccess() {
        console.log('Push reset returned');
        $ionicPlatform.ready(function() {
            if (window.plugins && window.plugins.toast) {
                window.plugins.toast.hide();
                if ($scope.push.checked) {
                    $cordovaToast.showShortBottom(
                        $translate.instant('Push notifications are turned on')
                    );
                } else {
                    $cordovaToast.showShortBottom(
                        $translate.instant('Push notifications are turned off')
                    );
                }
            }
        });
    }

    function afterPushResetFailure(error) {
        console.warn(error);
        $ionicPlatform.ready(function() {
            if (window.plugins && window.plugins.toast) {
                $cordovaToast.showLongBottom(
                    $translate.instant('Could not set up push notifications')
                );
            }
        });
        $scope.push.checked = false;
    }

    var blockChanges = false;
    var changedDuringBlock = false;
    function changeHandler() {
        console.log('Toggle push notifications');
        if (blockChanges) {
            changedDuringBlock = true;
        } else {
            blockChanges = true;
            $scope.push.checked = Settings.push($scope.push.checked);
            Push.reset()
            .then(afterPushResetSuccess, afterPushResetFailure)
            .finally(function() {
                console.log('Unblocking changes');
                blockChanges = false;
                if (changedDuringBlock) {
                    changedDuringBlock = false;
                    changeHandler();
                }
            });
        }
    }

    $scope.push = {
        checked: Settings.push(),
        changed: changeHandler,
    };

    $ionicModal.fromTemplateUrl('components/languageSwitcher/modal.html', {
        scope:     $scope,
        animation: 'slide-in-up',
    }).then(function(modal) {
        console.log(modal);
        $scope.languageSwitcher = modal;
    });
    $scope.$on('$destroy', function() {
        $scope.languageSwitcher.remove();
    });
    $scope.changeLanguage = function() {
        $scope.languageSwitcher.show();
    };
    $scope.closeModal = function() {
        $scope.languageSwitcher.hide();
    };
    $scope.update = Update;

    $ionicPlatform.ready(function() {
        if (window.cordova) {
            $cordovaAppVersion.getVersionNumber().then(function(version) {
                $scope.version = version;
            });
        } else {
            $scope.version = '3.3.10';
        }
    });
});
