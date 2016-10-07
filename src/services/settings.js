angular.module('ifiske.services')
.factory('Settings', function(localStorage, $translate) {
    // TODO: Persist some settings to Ionic Cloud?
    var settings = JSON.parse(localStorage.get('settings'));

    function updateSettings() {
        localStorage.set('settings', JSON.stringify(settings));
    }

    if (!settings) {
        settings = {
            push:     true,
            language: $translate.resolveClientLocale(),
        };
        updateSettings();
    }
    return {
        push: function(setPush) {
            if (setPush === undefined) {
                return settings.push;
            }
            settings.push = Boolean(setPush);
            updateSettings();

            return settings.push;
        },

        language: function(setLanguage) {
            if (setLanguage === undefined) {
                return settings.language;
            }
            settings.language = setLanguage;
            updateSettings();

            $translate.use(settings.language);
            return settings.language;
        },
    };
});
