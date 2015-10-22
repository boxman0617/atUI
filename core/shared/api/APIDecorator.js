(function() {
	var app = angular.module('atUI');

	app.config(['$provide', 
		function($provide) {
			$provide.decorator('APIService', ['$delegate', 'PromiseTemplateService', 'AlertMessageService', 'LogInService', 'localStorageService',
				function($delegate, PromiseTemplateService, AlertMessageService, LogInService, localStorageService) {
					var getFn = $delegate.get;
					var postFn = $delegate.post;
					var putFn = $delegate.put;
					var deleteFn = $delegate.delete;
					var nonBlockedGetFn = $delegate.nonBlockedGet;
					var decor = this;

					this.getPromiseTemplate = function() {
						var p = PromiseTemplateService.get();
						p._init = function() {
							var ref = this;
							this._promise.success(function(proxy, status, headers, config) {
								var h = headers('RefreshToken');
								if(angular.isDefined(h)) {
									localStorageService.set('token', h);
								}
								if(proxy.status === 'OK') {
									delete proxy.data[ref._argsConst];
									if(config.hasOwnProperty('raw') && config.raw === true) {
										ref._successCb(proxy.data, status, headers, config);
										return true;
									}
									if(Object.keys(proxy.data).length == 0) {
										ref._successCb(null, status, headers, config);
										return true;
									}
									for(var i in proxy.data) {
										var data = proxy.data[i];
										ref._successCb(data, status, headers, config);
										break;
									}
									return true;
								}

								if(proxy.status === 'EXCEPTION') {
									if(proxy.throwables[0].message === 'Reauthenticate') {
										LogInService.revokeStay(ref._successCb, arguments);
										localStorageService.remove('token');
										return true;
									}
									AlertMessageService.showError('Exception', ref._errorMessage(proxy));
									return true;
								}
							});
							this._promise.error(function(err, status, headers, config) {
								if(ref._errorCb !== null) {
									return ref._errorCb(err, status, headers, config);
								}
								if(status === 401) {
									LogInService.revokeStay();
									localStorageService.remove('token');
									return;
								}
								if(status === 403) {
									AlertMessageService.showError('Forbidden', 'You are forbidden from making this action. Please contact your manager if you require access.');
									return;
								}
								if(status === 501) {
									AlertMessageService.showError('Not Implemented', 'The feature you asked for is not implemented. Please contact an Admin for help.');
									return;
								}
								AlertMessageService.showError('Error', 'An unknown error has occured!');
							});
						};
						return p;
					};

					$delegate.get = function(url, config) {
						config = config || {};
						var ourPromise = decor.getPromiseTemplate();
						ourPromise._promise = getFn.apply($delegate, [url, config]);
						ourPromise._init();

						return ourPromise;
					};

					$delegate.post = function(url, data, headers) {
						headers = headers || {};
						var ourPromise = decor.getPromiseTemplate();
						ourPromise._promise = postFn.apply($delegate, [url, data, headers]);
						ourPromise._init();

						return ourPromise;
					};

					$delegate.put = function(url, data, headers) {
						headers = headers || {};
						var ourPromise = decor.getPromiseTemplate();
						ourPromise._promise = putFn.apply($delegate, [url, data, headers]);
						ourPromise._init();

						return ourPromise;
					};
					
					$delegate.delete = function(url, config) {
						config = config || {};
						var ourPromise = decor.getPromiseTemplate();
						ourPromise._promise = deleteFn.apply($delegate, [url, config]);
						ourPromise._init();

						return ourPromise;
					};

					$delegate.nonBlockedGet = function(url, config) {
						config = config || {};
						var ourPromise = decor.getPromiseTemplate();
						ourPromise._promise = nonBlockedGetFn.apply($delegate, [url, config]);
						ourPromise._init();

						return ourPromise;
					};

					return $delegate;
				}
			]);
		}
	]);
})();