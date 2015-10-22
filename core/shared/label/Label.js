(function() {
	var app = angular.module('atCore');
	
	var directive = function() {
		return {
			'template': '<span class="label" ng-class="_le">{{label}}</span>',
			'scope': {
				'label': '=',
				'options': '='
			},
			'controller': function($scope, $element) {
				$scope._le = {};
				var _le = {};
				
				$scope.$watch('label', function(newValue, oldValue) {
					if(newValue !== oldValue) {
						updateClasses();
					}
				});
				
				var updateClasses = function() {
					for(var clazz in $scope.options) {
						_le[clazz] = ($scope.options[clazz] === $scope.label); 
					}
					
					$scope._le = _le;
				};
				updateClasses();
			}
		};
	};
	
	app.directive('atLabel', [directive]);
})();