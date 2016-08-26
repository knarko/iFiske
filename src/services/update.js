angular.module('ifiske.services')
.provider('Update', function UpdateProvider() {
    this.$get = function(
        localStorage,
        $q,
        $ionicLoading,
        $cordovaToast,
        $ionicPlatform,
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
        User
    ) {
        var LAST_UPDATE = 'last_update';

        var updates = [
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
            var lastUpdate = localStorage.get(LAST_UPDATE);

            var aWeek = 1000 * 3600 * 24 * 7;
            return (currentTime - lastUpdate) > aWeek;
        }

        function updateFunc(forced, hideLoading) {
            if (!hideLoading)
                $ionicLoading.show();
            var currentTime = Date.now();
            var shouldUpdate = (forced || timedUpdate(currentTime));

            var promises = [];
            for (var i = 0; i < updates.length; ++i) {
                promises.push(updates[i](shouldUpdate));
            }

            return $q.all(promises).then(function() {
                if (shouldUpdate) {
                    localStorage.set(LAST_UPDATE, currentTime);
                }
            }, function(err) {
                // TODO: move this error handling somewhere else
                $ionicPlatform.ready(function() {
                    if (window.plugins) {
                        $cordovaToast.show('Tyvärr kan appen inte komma åt iFiskes server. Är du ansluten till nätverket?', 'long', 'bottom');
                    } else {
                        console.warn('Cannot toast');
                    }
                });
                // Must rethrow error to fail later
                throw err;
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
