angular.module('ifiske.directives')
  .directive('uiShowPassword', [
    function() {
      return {
        restrict: 'A',
        scope:    true,
        link:     function(_scope, elem, _attrs) {
          var btnShowPass = angular.element(`
            <button type="button"
              class="button button-clear button-positive button-display-password"
            >
              <i class="icon ion-eye"></i>
            </button>
          `);
          var elemType = elem.attr('type');

          // this hack is needed because Ionic prevents browser click event
          // from elements inside label with input
          btnShowPass.on('mousedown', function(evt) {
            if (elem.attr('type') === elemType) {
              elem.attr('type', 'text');
            } else {
              elem.attr('type', elemType);
            }

            btnShowPass.find('i').toggleClass('ion-eye-disabled');
            // prevent input field focus
            evt.stopPropagation();
          });

          btnShowPass.on('touchend', function(evt) {
            var syntheticClick = new Event('mousedown');
            evt.currentTarget.dispatchEvent(syntheticClick);

            // stop to block ionic default event
            evt.stopPropagation();
            evt.preventDefault();
          });

          if (elem.attr('type') === 'password') {
            elem.after(btnShowPass);
          }
        },
      };
    }]);
