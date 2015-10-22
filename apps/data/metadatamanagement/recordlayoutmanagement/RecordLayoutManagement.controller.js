(function() {
	var app = angular.module('atUI');

	// ## Controller: RecordLayoutManagementController
	app.controller('RecordLayoutManagementController', [
	'$scope', 'RecordLayoutService', 'APIService', '$cookies', '$log',
		function($scope, RecordLayoutService, APIService, $cookies, $log) {
			var ref = this;
			this.folder_name = 'data/metadatamanagement/recordlayoutmanagement';
			$scope.testingAPI = false;

			// ## List View Setup
			$scope.listLoaded = false;
			$scope.layoutList = [];
			RecordLayoutService.onUpdate(function(layouts) {
				$scope.layoutList = layouts;
				$scope.listLoaded = true;
			});
			RecordLayoutService.refresh();

			$scope.newLayout = function() {
				RecordLayoutService.select(false);
				$scope.current_view = 'assets/templates/apps/'+ref.folder_name+'/newLayout/_newLayoutView.html';
			};

			$scope.selectLayout = function(layout) {
				RecordLayoutService.select(layout);
				$scope.$emit('at-layout-change-to-edit-mode');
			};
			// ##
			
			// ## Reset
			$scope.$on('at-layout-reset', function() {
				RecordLayoutService.refresh();
				$scope.current_view = null;
			});
			// ##

			// ## View
			$scope.current_view = null;

			$scope.$on('at-layout-locked-layout', function() {
				var s = RecordLayoutService.getSelected();
				$scope.current_view = 'assets/templates/apps/'+ref.folder_name+'/lockedLayout/_lockedLayoutView.html?t='+s.name+'&t='+moment().toISOString();
			});

			$scope.$on('at-layout-change-to-edit-mode', function() {
				var s = RecordLayoutService.getSelected();
				$scope.current_view = 'assets/templates/apps/'+ref.folder_name+'/editLayout/_editLayoutView.html?t='+s.name+'&t='+moment().toISOString();
			});
			// ##
		}
	]);

	// ## Directives
	app.directive('atLayoutPanels', [function() {
		return {
			'restrict': 'A',
			'link': function(scope, element, attrs) {
				var listview_height = $('#record-layout-list-viewer').outerHeight();
				var layout_action_button_height = $('#layout-action-button').outerHeight();

				var h = listview_height - (parseInt(element.prev('.row').outerHeight()) + (layout_action_button_height));
				element.css({
					'height': h
				});
			}
		};
	}]);
})();