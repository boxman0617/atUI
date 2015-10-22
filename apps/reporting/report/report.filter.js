(function() {
    var atUI = angular.module('atUI');

    atUI.filter('camelcaseToCapWords', function() {
        return function(type) {
            return type.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\w\S*/g, function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        };
    });
})();