(function() {
	var app = angular.module('atUI');

	app.controller('RecordManagementController', ['$scope', 'StoreService',
		function($scope, StoreService) {
			StoreService.leftOffHere();
		}
	]);
})();