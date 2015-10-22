(function() {
	// PROD only file
	var app = angular.module('atUI');

	app.config(['$compileProvider', function ($compileProvider) {
		$compileProvider.debugInfoEnabled(false);
	}]);
})();