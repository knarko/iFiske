angular.module('ifiske.services')
.factory('Settings', function(localStorage, $translate, $window, $ionicHistory) {
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

        availableLanguages: function() {
            return {
                se: {
                    short: 'se',
                    long:  'Svenska',
                },
                en: {
                    short: 'en',
                    long:  'English',
                },
                de: {
                    short: 'de',
                    long:  'Deutsch',
                },
            };
        },

        language: function(setLanguage) {
            if (setLanguage === undefined) {
                return settings.language;
            }
            settings.language = setLanguage;
            localStorage.set('language', settings.language);
            updateSettings();

            $translate.use(settings.language);
            $ionicHistory.clearCache();

            if ($window.ga)
                $window.ga.trackMetric('Language', settings.language);

            return settings.language;
        },
    };
});
