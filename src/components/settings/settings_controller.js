angular.module('ifiske.controllers')
.controller('SettingsCtrl', [
    '$scope',
    'Push',
    'Settings',
    'Update',
    '$cordovaToast',
    '$cordovaAppVersion',
    '$ionicPlatform',
    function($scope, Push, Settings, Update, $cordovaToast, $cordovaAppVersion, $ionicPlatform) {
        var blockChanges = false;
        var changedDuringBlock = false;
        function changeHandler() {
            console.log('Toggle push notifications');
            if (!blockChanges) {
                blockChanges = true;
                $scope.push.checked = Settings.push($scope.push.checked);
                Push.reset().then(function() {
                    console.log('Push reset returned');
                    $ionicPlatform.ready(function() {
                        if (window.plugins && window.plugins.toast) {
                            window.plugins.toast.hide();
                            if ($scope.push.checked) {
                                $cordovaToast.showShortBottom('Du kommer nu att få push-notifikationer');
                            } else {
                                $cordovaToast.showShortBottom('push-notifikationer är nu avstängda.');
                            }
                        }
                    });
                }, function(error) {
                    console.warn(error);
                    $ionicPlatform.ready(function() {
                        if (window.plugins && window.plugins.toast) {
                            $cordovaToast.showLongBottom('Could not setup push notifications');
                        }
                    });
                    $scope.push.checked = false;
                }).finally(function() {
                    console.log('Unblocking changes');
                    blockChanges = false;
                    if (changedDuringBlock) {
                        changedDuringBlock = false;
                        changeHandler();
                    }
                });
            } else {
                changedDuringBlock = true;
            }
        }

        $scope.push = {
            checked: Settings.push(),
            changed: changeHandler,
        };

        $scope.changeLanguage = function(lang) {
            Settings.language(lang);
            Update.forcedUpdate();
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
    },
]);
