(function() {
	var app = angular.module('atUI');

	app.controller('DashboardController', ['$scope', '$log', 'UserService',
		function($scope, $log, UserService) {
			$scope.user = null;

			UserService.getUserInfo(function(user) {
				$scope.user = user;
			});
		}
	]);
})();