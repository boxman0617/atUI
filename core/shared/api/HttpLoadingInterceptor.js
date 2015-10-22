(function() {
	var app = angular.module('atUI');

	app.factory('HttpLoadingInterceptor', ['LoadingScreenService', 'AlertMessageService', '$q',
		function(LoadingScreenService, AlertMessageService, $q) {
			var HttpLoadingInterceptor = {
				'request': function(config) {
					if(config.hasOwnProperty('loadingScreen') && config.loadingScreen === false) {
						return config;
					}
					if(config.url.indexOf('.html') === -1) {
						LoadingScreenService.show();
					}
					return config;
				},
				'response': function(res) {
					if(res.config.hasOwnProperty('loadingScreen') && res.config.loadingScreen === false) {
						return res;
					}
					if(res.config.url.indexOf('.html') === -1) {
						LoadingScreenService.hide();
					}

					return res;
				},
				'responseError': function(res) {
					if(res.config.hasOwnProperty('loadingScreen') && res.config.loadingScreen === false) {
						return $q.reject(res);
					}

					if(res.config.url.indexOf('.html') === -1) {
						LoadingScreenService.hide();
					} else {
						AlertMessageService.showError('Oh no!', 'Unable to fulfill request.');
					}

					return $q.reject(res);
				}
			};

			return HttpLoadingInterceptor;
		}
	]);
})();