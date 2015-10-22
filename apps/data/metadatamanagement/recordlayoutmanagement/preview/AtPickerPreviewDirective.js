(function() {
	var app = angular.module('atUI');

	app.directive('atSegmentPreview', ['SegmentPreviewService', 
		function(SegmentPreviewService) {
			return {
				'restrict': 'A',
				'templateUrl': 'assets/templates/apps/data/metadatamanagement/recordlayoutmanagement/preview/_atSegmentPreview.html',
				'controller': function($scope, $element) {
					$scope.displaying = false;
					$scope.preview = null;

					SegmentPreviewService.onChange(function(segment) {
						$scope.$broadcast('preview-changed', segment.name);
						$scope.preview = segment;
					});
				},
				'link': function(scope, element, attrs) {
					var $rows = element.find('.preview-wrapper:first-child > .row');
					var rowsHeight = $($rows[0]).height() + $($rows[1]).height();
					var wrapperHeight = element.find('.preview-wrapper').height();
					var headerRowHeight = element.find('.field-list > .row').height();
					element.find('.field-list .scroll-rows').css({
						'height': parseInt(wrapperHeight) - (parseInt(rowsHeight) + parseInt(headerRowHeight))
					});
				}
			};
		}
	]);
})();