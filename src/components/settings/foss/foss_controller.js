angular.module('ifiske.services')
  .controller('FossController', [
    '$scope',
    '$ionicModal',
    'Licenses',
    function FossController($scope, $ionicModal, Licenses) {
      Licenses.get().then(function(data) {
        $scope.licenses = data.data.sort(function(a, b) {
          // eslint-disable-next-line no-nested-ternary
          return a.title < b.title ? -1 : b.title < a.title ? 1 : 0;
        });
      });

      $scope.alert = function(l) {
        var scope = $scope.$new();
        scope.l = l;
        $ionicModal.fromTemplateUrl(
          'components/settings/foss/modal.html',
          {scope: scope},
        ).then(function(modal) {
          scope.closeModal = function() {
            modal.hide();
          };
          modal.show();
        });
      };
    },
  ]);
