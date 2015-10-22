(function() {
	var app = angular.module('atUI');
	
	class MemoryFootprintController {
		constructor($scope, $element, $window, $interval) {
			this.$scope = $scope;
			this.$element = $element;
			this.$window = $window;
			this.$interval = $interval;
			
			this._init();
		}
		
		_init() {
			var self = this;
			
			this._seconds = 30;
			this.$scope.memory = {
				'usage': 0,
				'total': 0
			};
			
			this.calcMemory();
			this.$interval(function() {
				self.calcMemory();
			}, this._seconds * 1000);
		}
		
		calcMemory() {
			var m = this.$window.performance.memory;
			this.$scope.memory.usage = m.usedJSHeapSize / 1000000;
			this.$scope.memory.total = m.totalJSHeapSize / 1000000;
		}
	}
	
	app.directive('memoryFootprint', [function() {
		return {
			'template': '{{memory.usage}}Mb/{{memory.total}}Mb',
			'controller': ['$scope', '$element', '$window', '$interval', MemoryFootprintController]
		};
	}]);
})();