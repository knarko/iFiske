angular.module('ifiske.services')
.factory('Settings', [
    'localStorage',
    function(localStorage) {
        //TODO: Persist some settings to Ionic Cloud
        var settings = localStorage.get(settings) || {
            push: true,
        };

        function updateSettings() {
            localStorage.set('settings', JSON.stringify(settings));
        }

        updateSettings();
        return {
            push: function(setPush) {
                if (setPush === undefined) {
                    return settings.push;
                }
                settings.push = !!setPush;
                updateSettings();

                return settings.push;
            }
        };

    }
]);
