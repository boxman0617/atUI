(function() {
	var app = angular.module('atUILogin');

	app.controller('LoginScreenController', ['$scope', 'APIService', '$window', 'localStorageService',
		function($scope, APIService, $window, localStorageService) {
			$scope.user = {
				'loginID': null,
				'password': null,
				'remember': true
			};

			var _checkIfRemembered = function() {
				var _loginID = simpleStorage.get('loginID');
				if(angular.isDefined(_loginID)) {
					$scope.user.loginID = _loginID;
				}
			};
			_checkIfRemembered();

			$scope.canLogIn = function() {
				if($scope.user.loginID !== null && $scope.user.loginID !== '') {
					if($scope.user.password !== null && $scope.user.password !== '') {
						return false;
					}
				}
				return true;
			};

			$scope.$on('do-login', function() {
				if(!$scope.canLogIn()) {
					$scope.logIn();
				}
			});

			$scope.logIn = function() {
				APIService.post('auth/login/do', {
					'loginID': $scope.user.loginID,
					'password': $scope.user.password
				}).success(function(res) {
					if(res.status === 'OK') {
						if($scope.user.remember) {
							simpleStorage.set('loginID', res.data[0].logonID.toLowerCase());
						} else {
							simpleStorage.deleteKey('loginID');
						}
						localStorageService.set('token', res.data[100]);
						$window.location.replace('/index.html');
					}
				}).error(function(data, status) {
					console.log(data, status);
				});
			};
		}
	]);

	app.directive('passwordField', [
		function() {
			return {
				'link': function(scope, element) {
					element.on('keyup', function(e) {
						var code = e.keyCode || e.which;
						if(code === 13) {
							scope.$broadcast('do-login');
						}
					});
				}
			};
		}
	]);
})();