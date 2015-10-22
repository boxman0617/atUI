(function() {
	var app = angular.module('atCore');
	
	app.directive('listBox', ['$sce', function($sce) {
		return {
			'scope': {
				'box': '=',
			},
			'templateUrl': 'assets/templates/core/shared/listBox/main.html',
			'priority': 10,
			'controller': function($scope, $element, $attrs) {
				var box = $scope.box;
				$scope.title = box.title;
				$scope.icon = box.icon;
				$scope.isSearchEnabled = box.search;
				$scope.list = [];
				$scope.search = '';
				$scope.results = [];
				$scope.selected = false;
				$scope.active = 0;
				$scope.selectedOne = null;
				
				box.watch('search', function(oldValue, newValue) {
					$scope.isSearchEnabled = newValue;
					$scope.$emit('list-box-redo-full-height');
				});
				
				box.watch('list', function(oldValue, newValue) {
					if(newValue.length > 0) {
						$scope.list = newValue;
					}
				});
				
				$scope.$watch('search', function(newValue, oldValue, scope) {
					if(scope.results.length === 0 || scope.selected !== false && angular.isDefined(scope.selected) && newValue !== scope.results[scope.selected].original) {
						scope.selected = false;
					}
					if(newValue !== oldValue && newValue !== '' && scope.selected === false) {
						var m = fuzzy.filter(newValue, scope.list, {
							'pre': '<strong>',
							'post': '</strong>'
						});
						scope.results = [];
						scope.active = 0;
						for(var i in m) {
							scope.results.push({
								'string': $sce.trustAsHtml(m[i].string),
								'original': m[i].original
							});
						}
					}
					if(newValue === '') {
						scope.results = [];
					}
				});

				$scope.onDownArrow = function() {
					if(parseInt($scope.active) + 1 < $scope.results.length) {
						$scope.$apply(function() {
							$scope.active = parseInt($scope.active) + 1;
						});
					}
				};

				$scope.onUpArrow = function() {
					if(parseInt($scope.active) - 1 >= 0) {
						$scope.$apply(function() {
							$scope.active = parseInt($scope.active) - 1;
						});
					}
				};

				$scope.onEnter = function() {
					$scope.$apply(function() {
						$scope.selectGroup($scope.active);
					});
				};
			},
			'link': function(scope, element) {
				scope.$watchGroup('results', function(newValue, oldValue) {
					if(newValue.length > 0) {
						element.on('keydown', function(e) {
							if(e.which === 40) { // Down Arrow
								scope.onDownArrow();
								return e.preventDefault();
							} else if(e.which === 38) { // Up Arrow
								scope.onUpArrow();
								return e.preventDefault();
							} else if(e.which === 13) { // Enter
								scope.onEnter();
								return e.preventDefault();
							}
						});
					} else {
						element.off('keydown');
					}
				});

				scope.$watch('active', function(newValue, oldValue) {
					var $results = element.find('.list-viewer-wrapper');
					var F = $results.outerHeight();
					if(newValue !== oldValue) {
						var T = element.find('.active').outerHeight();
						var O = ((parseInt(newValue) + 2) * T);
						var X = Math.abs(F - O);
						if(O > F) {
							$results.scrollTop(X);
						} else {
							$results.scrollTop(0);
						}
					}
				});
			}
		};
	}]);
})();