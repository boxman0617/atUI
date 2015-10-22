(function() {
	var app = angular.module('atUI');

	app.controller('AppController', ['$scope', 'LocaleLabels', '$log', 'StoreService', 'UserService', '$route', '$timeout', 'LoadingScreenService', 'localStorageService', 

		function($scope, LocaleLabels, $log, StoreService, UserService, $route, $timeout, LoadingScreenService, localStorageService) {
			
			var _token = localStorageService.get('token');
			if(_token === null) {
				window.location = '/login.html';
			}
			
			$scope.$on('$routeChangeStart', function(e, u) {
				if(!u.hasOwnProperty('$$route') || u.$$route.originalPath === '/login') {
					return;
				}
				_ping();
			});
			
			var _ping = function() {
				UserService.ping(function() {
					$scope.isOk = 'assets/templates/core/layout/app.html';
				});
			};
		
			$scope.words = {};
			LocaleLabels.onRefresh(function(labels) {
				$scope.words = labels;
			});

			$scope.leftOff = StoreService.getWhereWeLeftOff();
			$scope.nameLeftOff = StoreService.getRawLeftOff();

			$scope.isOk = null;

			$scope.$watch('isOk', function(newValue, oldValue) {
				if(newValue !== null) {
					$route.reload();
				}
			});
			
			$scope.$on('refresh-failed-ping', function() {
				LoadingScreenService.show();
				$timeout(function() {
					_ping();
					LoadingScreenService.hide();
				}, 5000);
			});

			$scope.$on('$destroy', function() {
				$log.warn('AppController is now being destroyed! Should never happen...');
			});
		}
	]);

	app.filter('leftOffName', [
		function() {
			return function(route) {
				route = route || null;

				if(route === null) {
					return '';
				}

				if(route.indexOf('/') !== false) {
					route = route.substr(1);
				}
				
				route = route.replace(/\/(\w+)\//ig, ', ').replace(/_/ig, ' ');
				var s = route.split(' ');
				var r = '';
				for(var i in s) {
					if(parseInt(i) === 0) {
						r += s[i]+' ';
						continue;
					}

					r += s[i].charAt(0).toUpperCase() + s[i].slice(1)+' ';
				}

				return route;
			};
		}
	]);
})();