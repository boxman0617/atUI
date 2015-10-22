(function() {
	angular.module('atUI').directive('deploymentsToolbarItem', ['PlatformService', function(PlatformService) {
		return {
			'templateUrl': 'assets/templates/core/layout/header/deploymentsToolbarItem.html',
			'controller': function($scope, $element) {
				$scope.deployments = [];
				$scope.selectedDeployment = null;
				
				PlatformService.onChange(function() {
					$scope.deployments = PlatformService.getPlatforms();
					$scope.selectedDeployment = PlatformService.current;
				});
				
				PlatformService.fetchPlatforms(function() {
					$scope.deployments = PlatformService.getPlatforms();
					$scope.selectedDeployment = PlatformService.current; 
				});
				
				$scope.selectDeployment = function(deployment) {
					$scope.selectedDeployment = deployment;
					PlatformService.current = deployment;
				};
			}
		};
	}])
})();