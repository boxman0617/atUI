(function() {
	angular.module('atUI').directive('toolbarItemsHolder', ['ToolbarService', '$compile', function(ToolbarService, $compile) {
		return {
			'controller': function($scope, $element) {
				$scope.tools = [];
				var _redered = [];
				
				var _compileItem = function(item) {
					let temp = '<div class="btn-group" ng-show="tools['+($scope.tools.length - 1)+'].display" '+item.directive.replace(/([A-Z])/g, function($1) {
						return '-'+$1.toLowerCase();
					})+'></div>';
					$element.append($compile(temp)($scope));
				};
				
				ToolbarService.watch('change', function(oldValue, newValue) {
					$scope.tools = newValue;
					if(oldValue.length < newValue.length) {
						let item = angular.copy(newValue).pop();
						_compileItem(item);
					}
				});
				
				ToolbarService.add({
					'id': 'core/Language',
					'directive': 'languageToolbarItem'
				});
				
				ToolbarService.add({
					'id': 'core/Deployments',
					'directive': 'deploymentsToolbarItem'
				});
			}
		};
	}]);
})();