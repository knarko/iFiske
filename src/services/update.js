angular.module('ifiske.services')
  .provider('Update', function UpdateProvider() {
    this.$get = function(
      localStorage,
      $q,
      $ionicLoading,
      ToastService,
      Area,
      County,
      Fish,
      MapData,
      News,
      Organization,
      Product,
      Rule,
      Technique,
      Terms,
      User,
    ) {
      const LAST_UPDATE = 'last_update';

      const updates = [
        Area.update,
        County.update,
        Fish.update,
        MapData.update,
        News.update,
        Organization.update,
        Product.update,
        Rule.update,
        Technique.update,
        Terms.update,
        User.update,
      ];

      function timedUpdate(currentTime) {
        const lastUpdate = localStorage.get(LAST_UPDATE);

        const aDay = 1000 * 3600 * 24 * 1;
        return (currentTime - lastUpdate) > aDay;
      }

      function updateFunc(forced, hideLoading) {
        if (!hideLoading)
          $ionicLoading.show();
        const currentTime = Date.now();
        const shouldUpdate = (forced || timedUpdate(currentTime));

        const promises = [];
        for (let i = 0; i < updates.length; ++i) {
          promises.push(updates[i](shouldUpdate));
        }

        return $q.all(promises).then(function() {
          if (shouldUpdate) {
            localStorage.set(LAST_UPDATE, currentTime);
          }
        }, function(error) {
          console.error(error);

          Raven.captureException(error);
          ToastService.show(['Network Error', {error: error.response || error}], 'long');

          // Must rethrow error to fail later
          throw error;
        })
          .finally(function() {
            $ionicLoading.hide();
          });
      }

      return {
        update: function(hideLoading) {
          return updateFunc(false, hideLoading);
        },

        forcedUpdate: function(hideLoading) {
          return updateFunc(true, hideLoading);
        },

        lastUpdate: function() {
          return localStorage.get(LAST_UPDATE);
        },
      };
    };
  });
