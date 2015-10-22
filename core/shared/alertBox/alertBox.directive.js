(function() {
	var app = angular.module('atCore');
	
	app.directive('alertBox', ['AlertMessageService', function(AlertMessageService) {
		return {
			'restrict': 'A',
			'scope': {},
			'controller': function($scope) {
				$scope.data = AlertMessageService.scope;
			},
			'templateUrl': 'assets/templates/core/shared/alertBox/alertBox.template.html'
		}
	}]);

	app.directive('atAlertBoxButton', [function() {
		return {
			'restrict': 'A',
			'link': function(scope, element, attrs) {
				if(scope.btn.dismiss) {
					element.attr('data-dismiss', 'modal');
				}
			}
		};
	}]);
})();