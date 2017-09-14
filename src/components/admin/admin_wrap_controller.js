angular.module('ifiske.controllers')
  .controller('AdminWrapCtrl', function($state, $scope, $cordovaBarcodeScanner) {
    $scope.scanQR = function() {
      try {
        $cordovaBarcodeScanner.scan().then(function(res) {
          if (res.cancelled) {
            throw new Error('Cancelled');
          }
          if (res.format === 'QR_CODE') {
            const url = new URL(res.text);
            const searchParams = new URLSearchParams(url.search);
            if (searchParams.has('e')) {
              return searchParams.get('e');
            }
          } else {
            throw new Error('Not a QR code');
          }
        }).then(function(code) {
          console.log('Scanned: ', code);
          $state.go('^.product', {code: code});
        }, function(err) {
          console.warn(err);
        });
      } catch (err) {
        console.error(err);
        Raven.captureException(err);
        // $state.go('^.product', {code: '904192'});
      }
    };
  });
