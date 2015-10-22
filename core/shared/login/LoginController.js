(function() {
	var app = angular.module('atCore');

	app.directive('loginModal', ['LogInService',
		function(LogInService) {
			return {
				'templateUrl': 'assets/templates/core/shared/login/login_modal.html',
				'controller': function($scope, $element, $attrs) {
					$scope.user = {
						'loginID': null,
						'password': null,
						'remember': false
					};

					var _checkIfRemembered = function() {
						var _loginID = simpleStorage.get('loginID');
						if(angular.isDefined(_loginID)) {
							$scope.user.loginID = _loginID;
							$scope.user.remember = true;
						}
					};
					_checkIfRemembered();

					$scope.doLogIn = function() {
						LogInService.doLogIn({
							'loginID': $scope.user.loginID,
							'password': $scope.user.password
						}, function() {
							if($scope.user.remember) {
								simpleStorage.set('loginID', $scope.user.loginID.toLowerCase());
							} else {
								simpleStorage.deleteKey('loginID');
							}

							$element.find('.modal').modal('hide');
						});
					};

					$scope.canLogIn = function() {
						if($scope.user.loginID !== null && $scope.user.loginID !== '') {
							if($scope.user.password !== null && $scope.user.password !== '') {
								return false;
							}
						}
						return true;
					};

					this.openModal = function(element) {
						element.find('.modal').modal({
							'backdrop': 'static',
							'keyboard': false
						});
					};

					LogInService.setModalCB(function() {
						this.openModal($element);
					}, this);
				},
				'link': function(scope, element, attrs, crtl) {
					scope.$on('login-modal-requested', function() {
						crtl.openModal(element);
					});

					element.find('.modal').on('shown.bs.modal', function() {
						element.find('.loginID-field').focus();
					});
					element.find('.modal').on('hidden.bs.modal', function() {
						scope.user.password = null;
						if(scope.user.remember === false) {
							scope.user.loginID = null;
						}
					});
				}
			};
		}
	]);
})();