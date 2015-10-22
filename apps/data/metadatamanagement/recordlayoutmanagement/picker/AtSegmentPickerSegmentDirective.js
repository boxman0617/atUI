(function() {
	var app = angular.module('atUI');

	app.directive('atSegmentPickerSegment', ['SegmentPreviewService', 'SegmentListService', 'SegmentGrabService', '$document', 
		function(SegmentPreviewService, SegmentListService, SegmentGrabService, $document) {
			return {
				'require': '^atSegmentPicker',
				'scope': {
					'segment': '='
				},
				'templateUrl': 'assets/templates/apps/data/metadatamanagement/recordlayoutmanagement/picker/_atSegmentPickerSegment.html',
				'controller': function($scope, $element) {
					$scope.segment.previewing = false;
					var _dragObject = {
						'e': null,
						'start': {'x': 0, 'y': 0},
						'current': {'x': 0, 'y': 0},
						'offset': {'x': 5, 'y': -10}
					};

					if($scope.segment.has_many_versions) {
						$scope.segment.other_version_select = $scope.segment.versions[$scope.segment.versions.length - 1];
					}

					$scope.previewMe = function(segment) {
						SegmentPreviewService.set(segment);
					};

					$scope.onGrab = function(e) {
						e.preventDefault();

						if($scope.segment.other_version_select.name !== 'Latest') {
							SegmentListService.fetchByNameAndVersion(
								$scope.segment.other_version_select.id.name, 
								$scope.segment.other_version_select.id.version,
							function(segment) {
								segment.latest = false;
								SegmentGrabService.grab(segment);
							}, false);
						} else {
							SegmentListService.fetchLatestSegment($scope.segment.name+' - ', 
							function(segment) {
								segment.latest = true;
								SegmentGrabService.grab(segment);
							}, false);
						}

						_dragObject.e = $('<div id="segment-drag">'+$scope.segment.name+'</div>');
						_dragObject.start.x = e.pageX + _dragObject.offset.x;
						_dragObject.start.y = e.pageY + _dragObject.offset.y;
						_dragObject.e.css({
							'top': _dragObject.start.y,
							'left': _dragObject.start.x
						});
						$('html').addClass('dragging-something');
						$element.append(_dragObject.e);
						$document.on('mousemove', mouseMove);
						$document.on('mouseup', mouseUp);
					};

					function mouseMove(e) {
						_dragObject.current.x = e.pageX + _dragObject.offset.x;
						_dragObject.current.y = e.pageY + _dragObject.offset.y;
						_dragObject.e.css({
							'top': _dragObject.current.y + 'px',
							'left': _dragObject.current.x + 'px'
						});
					};

					function mouseUp(e) {
						$scope.$apply(function() {
							SegmentGrabService.drop();
						});
						_dragObject.e.remove();
						$('html').removeClass('dragging-something');
						$('.over-dropzone').removeClass('over-dropzone');
						$document.off('mousemove', mouseMove);
	      				$document.off('mouseup', mouseUp);
					};
				}
			};
		}
	]);
})();