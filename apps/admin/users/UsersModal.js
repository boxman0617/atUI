(function() {
	var app = angular.module('atUI');
	
	function UsersModal(APIService, AdminModalService, UsersService, NotificationQueue) {
		return {
			'controller': function($scope, $element) {
				$scope.ldapUsers = [];
				$scope.surname = null;
				
				$scope.$watch('surname', function(oldValue, newValue, scope) {
					if(scope.surname !== null && scope.surname.length > 2) {
						runSearch();
					}
				});
				
				var runSearch = function() {
					UsersService.ldapSearch($scope.surname, function(results) {
						$scope.ldapUsers = results.map(function(u) {
							u.logonID = u.userPrincipalName.replace(/(\@.*$)/, '');
							return u;
						});
					});
				};
				
				AdminModalService.register('users', function() {
					$element.modal();
				});
				
				$scope.save = function() {
					
				};
			}
		};
	}
	
	app.directive('usersModal', ['APIService', 'AdminModalService', 'UsersService', 'NotificationQueue', UsersModal]);
})();