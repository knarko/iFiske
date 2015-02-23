angular.module('ifiske.filters', [])
.filter('nobrs', function() {
    return function(input) {
        return input.replace(/(<br>\s*)+/g, '<br>');
    };
});
