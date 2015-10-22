(function() {
	var app = angular.module('atUI');

	app.config(['$routeProvider', 
		function($routeProvider) {
			$routeProvider
				.when('/segmentManagement', {
					'templateUrl': 'assets/templates/apps/recordManagementTool/segmentManager/segment-dashboard.html',
					'controller': 'SegmentManagementController'
				})
				.when('/recordManagement', {
					'templateUrl': 'assets/templates/apps/recordManagementTool/recordManager/record-dashboard.html',
					'controller': 'RecordManagementController'
				})
				.when('/recordManagement/editor', {
					'templateUrl': 'assets/templates/apps/recordManagementTool/recordEditor/record-editor.html',
					'controller': 'RecordEditorController'
				});
		}
	]);
})();