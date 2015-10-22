(function() {
	var app = angular.module('atUI');
	
	angular.module('atCore').service('QueueManagerService', [
		function() {
			var _keepOn = true,
			_pause = null,
			_resume = null;
			
			this.onPause = function(cb) {
				_pause = cb;
			};
			
			this.onResume = function(cb) {
				_resume = cb;
			};
			
			this.resume = function() {
				_resume.apply(null, []);
			};
			
			this.pause = function() {
				_pause.apply(null, []);
			};
		}
	]);

	app.factory('HttpQueueInterceptor', ['$q', '$rootScope', 'QueueManagerService',
		function($q, $rootScope, QueueManagerService) {
			QueueManagerService.onPause(function() {
				run = false;
			});
			QueueManagerService.onResume(function() {
				run = true;
				_executeTop();
			});
			var _queue = [],
			run = true;

			$rootScope.$on('proceed-with-http-calls', function() {
				_executeTop();
			});

			var _executeTop = function() {
				if(!run) {
					return;
				}
				if(_queue.length === 0) {
					return;
				}
				_queue[0].resolve();
			};
			
			var _addRequest = function(req) {
				_queue.push(req);
				if(_queue.length === 1) {
					_executeTop();
				}
			};

			var HttpQueueInterceptor = {
				'request': function(config) {
					if(config.hasOwnProperty('skipQueue') && config.skipQueue === true) {
						return config;
					}
					if(config.url.indexOf('.html') === -1) {
						var deferred = $q.defer();
						_addRequest({
							'resolve': function() {
								deferred.resolve(config);
							},
							'url': config.url
						});
						return deferred.promise;
					}

					return config;
				},

				'response': function(response) {
					if(_queue.length === 0 || (response.config.hasOwnProperty('skipQueue') && response.config.skipQueue === true)) {
						return response;
					}
					if(response.config.url.indexOf('.html') === -1) {
						_queue.shift();
						_executeTop();
					}
					return response;
				},

				'responseError': function(responseError) {
					if(_queue.length === 0 || (responseError.config.hasOwnProperty('skipQueue') && responseError.config.skipQueue === true)) {
						return $q.reject(responseError);
					}
					if(responseError.config.url.indexOf('.html') === -1) {
						_queue.shift();
						_executeTop();
					}
					return $q.reject(responseError);
				}
			};

			return HttpQueueInterceptor;
		}
	]);
})();