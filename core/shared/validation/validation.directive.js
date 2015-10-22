(function() {
	
	var app = angular.module('atUI');
	
	app.directive('validation-phone', ['$log', function($log) {
		return {
			'restrict': 'AC',
			'link': function(scope, element, attrs) {
				$log.log(scope.arc[element.id]);
			}
		};
	}]);

})();