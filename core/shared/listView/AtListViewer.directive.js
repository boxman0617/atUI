(function() {
	var app = angular.module('atUI');

	app.directive('atListViewer', [function() {
		return {
			'restrict': 'A',
			'scope': {
				'list': '=',
				'loaded': '=',
				'newItem': '&',
				'onSelect': '&',
				'icon': '@',
				'title': '@atTitle',
				'newHoverTitle': '@'
			},
			'templateUrl': 'assets/templates/core/shared/listView/atlistviewer.template.html',
			'controller': function($scope, $element) {
				$scope.isLoading = true;
				var unwatch = $scope.$watch('loaded', function(newValue, oldValue) {
					if(newValue === true) {
						$scope.isLoading = false;
						unwatch();
					}
				});
			},
			'link': function(scope, element, attrs) {
				var stage_height = $('#stage').height();
				var wrapper_bottom = parseInt($('#stage .wrapper').css('padding-bottom'));
				var $mgma = $('#mgma');
				var toolbar_height = $mgma.find('.toolbar').height() + 
					(parseInt($mgma.find('.toolbar').css('padding-top')) * 2) + 
					parseInt($mgma.find('.toolbar').css('border-bottom-width'));
				var mgma_stage_top = parseInt($mgma.find('.mgma-stage').css('padding-top'));
				var element_height = stage_height - (wrapper_bottom + toolbar_height + mgma_stage_top);

				element.css({'height': element_height});

				element.find('.list-viewer-wrapper').css({
					'height': function() {
						var pad = (parseInt(element.css('padding-top')) + parseInt(element.css('border-top-width'))) * 2;
						return element_height - pad - element.find('.list-viewer-toolbar').height() - parseInt($(this).css('margin-top'));
					}
				});
			}
		};
	}]);

	app.directive('atListViewerItem', [function() {
		return {
			'restrict': 'A',
			'scope': {
				'item': '=',
				'icon': '='
			},
			'templateUrl': 'assets/templates/core/shared/listView/atlistvieweritem.template.html'
		};
	}]);
})();