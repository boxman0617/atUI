(function() {
	var app = angular.module('atUI');

	app.directive('atLayoutSegments', [
		function() {
			return {
				'template': '<div at-layout-segment-start segment="segment"></div>',
				'link': function(scope, element) {
					var _getStageHeight = function() {
						return $('.mgma-stage').height();
					};

					var _panelOuterOffset = function() {
						var $panel = element.closest('.panel');
						return Math.abs($panel.outerHeight() - $panel.height()) + parseFloat($panel.css('margin-bottom'));
					};

					var _panelHeadingHeight = function() {
						return element.parent().prev('.panel-heading').outerHeight();
					};

					var _setPanelHeight = function() {
						var $panel = element.closest('.panel');

						$panel.css({
							'height': Math.abs(_getStageHeight() - _panelOuterOffset())
						});
						$panel.find('.panel-body').css({
							'height': Math.abs(_getStageHeight() - (_panelHeadingHeight() + _panelOuterOffset()))
						});
					};
					_setPanelHeight();
				}
			};
		}
	]);

	app.directive('atLayoutSegmentStart', ['$compile',
		function($compile) {
			return {
				'templateUrl': 'assets/templates/apps/data/metadatamanagement/recordlayoutmanagement/layoutSegments/_atLayoutSegmentView.html',
				'controller': function($scope, $element) {
					var createChild = function(parent_segment_id) {
						var $child = $('<div at-layout-segment-start segment="segment"></div>');

						var childScope = $scope.$new();
						childScope.segment = $scope.segment.children[$scope.segment.children.length - 1];

						var child = $compile($child)(childScope);
						$element.find('.segment-children:first').append(child);
					};

					var createInitChildren = function() {
						var children = [];
						for(var i in $scope.segment.children) {
							var $child = $('<div at-layout-segment-start segment="segment"></div>');
							var childScope = $scope.$new();
							childScope.segment = $scope.segment.children[i];
							var child = $compile($child[0].outerHTML)(childScope);
							children.push(child);
						}
						$element.find('.segment-children:first').append(children);
					};

					var init = function() {
						if(!$scope.segment.hasOwnProperty('children')) {
							$scope.segment.children = [];
						} else {
							if($scope.segment.children.length > 0) {
								createInitChildren()
							}
						}
					};

					var unWatchInit = $scope.$watch('segment', function(newValue, oldValue) {
						if(newValue !== null && _elementID === null) {
							init();
							unWatchInit();
						}
					});
					if($scope.segment !== null) {
						unWatchInit();
						init();
					}
				}
			};
		}
	]);
})();