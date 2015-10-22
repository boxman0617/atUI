(function() {
	var app = angular.module('atUI');

	app.config(['$routeProvider', 
		function($routeProvider) {
			$routeProvider
				.when('/consumerCreditReport', {
					'templateUrl': 'assets/templates/apps/reportTool/inputScreen/consumer-input.html',
					'controller': 'InputScreenController'
				})
				.when('/consumerCreditReport/report', {
					'templateUrl': 'assets/templates/apps/reportTool/reportScreen/consumer-report.html',
					'controller': 'ReportController'
				});
		}
	]);
})();