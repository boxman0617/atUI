(function() {
	var app = angular.module('atUI');
	
	class DashOverallStatsController {
		constructor($scope, $element, APIService, PlatformService, StoreService) {
			this.$scope = $scope;
			this.$element = $element;
			this.APIService = APIService;
			this.PlatformService = PlatformService;
			this.StoreService = StoreService;
			
			this._init();
		}
		
		_init() {
			this._initScope();
		}
		
		_initScope() {
			var self = this;
			this.$scope.stats = {
				'platforms': 0,
				'layouts': 0,
				'segments': 0
			};
			this.$scope.leftOff = this.StoreService.getRawLeftOff();
			this.$scope.leftOffLocation = this.StoreService.getWhereWeLeftOff();
			
			this.PlatformService.onChange(function() {
				self._fetchStats();
			});
			
			this._fetchStats();
		}
		
		_fetchStats() {
			var self = this;
			this.APIService.get('dash/stats/'+this.PlatformService.current.id, {'cache': true}).success(function(stats) {
				self.$scope.stats = stats;
			});
		}
	}
	
	app.directive('dashOverallStats', [function() {
		return {
			'templateUrl': 'assets/templates/apps/home/dashboard/overallstats/dashOverallStats.html',
			'controller': ['$scope', '$element', 'APIService', 'PlatformService', 'StoreService', DashOverallStatsController]
		};
	}]);
})();