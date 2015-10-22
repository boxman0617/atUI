(function() {
	var app = angular.module('atUI');

	app.directive('atLayoutDropzone', ['SegmentGrabService', '$document', 'NotificationQueue',
		function(SegmentGrabService, $document, NotificationQueue) {
			return {
				'restrict': 'A',
				'templateUrl': 'assets/templates/apps/data/metadatamanagement/recordlayoutmanagement/dropZone/_atLayoutDropzone.html',
				'controller': function($scope, $element, $attrs) {
					$scope.canEdit = true;
					$scope.$on('layout-can-edit', function(e, status) {
						$scope.canEdit = status;
					});

					$scope.segmentsLocation = SegmentGrabService.segmentsLocation;

					/**
					 * This is the private variable that will hold the 
					 * copied/cut segments
					 * @type Object/null
					 */
					var clipboard = null;
					var ref = this;

					var stripElementId = function(segment) {
						for(var i in segment.children) {
							delete segment.children[i].$element_id;
							if(segment.children[i].children.length > 0) {
								stripElementId(segment.children[i]);
							}
						}
					};

					this.canIPaste = function() {
						return !(clipboard === null);
					};

					this.copy = function(context) {
						var segmentCopy = angular.copy(context.scope.segment);
						delete segmentCopy.$element_id;
						stripElementId(segmentCopy);

						NotificationQueue.push({
							'icon': 'files-o',
							'text': 'Copied segment to clipboard!'
						});
						clipboard = segmentCopy;
					};

					this.cut = function(context) {
						this.copy(context);
						this.remove(context);
					};

					this.remove = function(context) {
						var parent = context.scope.$parent;
						var grand = parent.$parent;
						for(var i in grand.segment.children) {
							if(grand.segment.children[i].$element_id === context.scope.segment.$element_id) {
								grand.segment.children.splice(i, 1);
								break;
							}
						}
						parent.$destroy();
					};

					this.paste = function(context) {
						context.scope.segment.children.push(clipboard);
						clipboard = null;
						$scope.$broadcast('dz-segment-'+context.scope.segment.$element_id, context.scope.segment.$element_id);
					};

					$scope.$on('$destroy', function() {
						$document.off('mouseup');
					});
				},
				'link': function(scope, element, attrs) {
					var panel_height = element.parent().parent().outerHeight();
					var panel_heading_height = element.parent().parent().find('.panel-heading').outerHeight();
					var h = panel_height - panel_heading_height;
					element.parent().css({
						'height': h
					});
					element.css({
						'height': h
					});
				}
			};
		}
	]);
})();