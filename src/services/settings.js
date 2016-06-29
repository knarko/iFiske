angular.module('ifiske.services')
.factory('Settings', [
    'localStorage',
    function(localStorage) {
        //TODO: Persist some settings to Ionic Cloud?
        var settings = JSON.parse(localStorage.get('settings'));

        function updateSettings() {
            localStorage.set('settings', JSON.stringify(settings));
        }

        if (!settings) {
            settings = {
                push: true,
            };
            updateSettings();
        }
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
