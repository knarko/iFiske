angular.module('ifiske.services')
  .service('ToastService', class ToastService {
    constructor($translate, $cordovaToast, $ionicPlatform) {
      this.$translate = $translate;
      this.$cordovaToast = $cordovaToast;
      this.$ionicPlatform = $ionicPlatform;
    }

    /**
     *
     * @param {string|array} text translatable text string or array of arguments to translate function
     * @param {string} duration (optional) 'short' or 'long'
     * @param {string} position (optional) 'top', 'center' or 'bottom'
     * @return {Promise} void promise
     */
    show(text, duration, position) {
      if (!duration) {
        duration = 'short';
      }
      if (!position) {
        position = 'bottom';
      }
      let translated;
      if (Array.isArray(text)) {
        translated = this.$translate.instant.apply(this.$translate, text);
      } else {
        translated = this.$translate.instant(text);
      }

      if (window.plugins && window.plugins.toast) {
        return this.$ionicPlatform.ready(() => {
          return this.$cordovaToast.show(translated, duration, position);
        });
      }
      console.log(translated);
      return Promise.reject('Cordova toast plugin not available');
    }

    hide() {
      return this.$ionicPlatform.ready(() => {
        return window.plugins.toast.hide();
      });
    }
  });
