(function() {
	var app = angular.module('atUI');

	app.config(['$httpProvider',
		function($httpProvider) {
			$httpProvider.interceptors.push('HttpLoadingInterceptor');
			$httpProvider.interceptors.push('HttpQueueInterceptor');
		}
	]);
})();