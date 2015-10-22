(function() {
	var app = angular.module('atUI');
	
	class DashDeploymentStatsController {
		constructor($scope, $element, APIService, PlatformService) {
			this.$scope = $scope;
			this.$element = $element;
			this.APIService = APIService;
			this.PlatformService = PlatformService;
			
			this._init();
		}
		
		_init() {
			this._initScope();
		}
		
		_initScope() {
			var self = this;
			this.$scope.data = [];
			this.$scope.labels = ['Layouts', 'Segments', 'Codes'];
			this.$scope.d = null;
			this.$scope.deployments = [];
			
			this.PlatformService.onChange(function() {
				self.$scope.deployments = self.PlatformService.getPlatforms();
				self.selectDeployment(self.PlatformService.current);
			});
			
			this.PlatformService.fetchPlatforms(function() {
				self.$scope.deployments = self.PlatformService.getPlatforms();
				self.selectDeployment(self.PlatformService.current);
			});
			
			this.$scope.selectDeployment = function(deployment) {
				self.selectDeployment(deployment);
			};
		}
		
		selectDeployment(deployment) {
			this.$scope.d = deployment;
			this.fetchData();
		}
		
		fetchData() {
			var self = this;
			this.APIService.get('platform/'+this.$scope.d.id+'/stats', {'cache': true}).success(function(data) {
				var d = [data.layouts, data.segments, data.codes];
				self.$scope.data = [];
				self.$scope.data.push(d);
			});
		}
	}
	
	app.directive('dashDeploymentStats', [function() {
		return {
			'templateUrl': 'assets/templates/apps/home/dashboard/deploymentstats/dashDeploymentStats.html',
			'controller': ['$scope', '$element', 'APIService', 'PlatformService', DashDeploymentStatsController]
		};
	}]);
})();