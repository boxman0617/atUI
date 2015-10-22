(function() {
	var app = angular.module('atCore');

	app.service('LogInService', ['$http', 'APIUrlLocator', 'QueueManagerService', '$rootScope', 'localStorageService', '$timeout', '$log',
		function($http, APIUrlLocator, QueueManagerService, $rootScope, localStorageService, $timeout, $log) {
			var openModalCB = null;
			var ctrl = null;
			var successCb = null;
			var successArgs = [];
			var ref = this;

			this.setModalCB = function(cb, ref) {
				openModalCB = cb;
				crtl = ref;
			};

			this.revokeStay = function(cb, args) {
				QueueManagerService.pause();
				successCb = cb;
				successArgs = args;
				if(openModalCB === null) {
					$timeout(function() {
						openModalCB.apply(crtl, []);
					}, 10);
				} else {
					openModalCB.apply(crtl, []);
				}
			};

			this.doLogIn = function(creds, cb) {
				$http.post(APIUrlLocator.getUrl('auth/login/do'), creds, {'skipQueue': true}).success(function(res) {
					if(res.status === 'OK') {
						localStorageService.set('token', res.data[100]);
						QueueManagerService.resume();
						if(angular.isDefined(ref.successCb)) {
							ref.successCb.apply(null, successArgs);
						}
						$rootScope.$broadcast('refresh-failed-ping');
						cb();
					} else {
						$log.error(res.throwables[0].message);
					}
				}).error(function(data, status) {
					$log.log(data, status); // @ToDo: Remove this
				});
			};
		}
	]);
})();