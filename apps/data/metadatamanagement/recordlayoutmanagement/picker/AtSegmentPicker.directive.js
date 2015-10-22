(function() {
	var app = angular.module('atUI');

	app.directive('atSegmentPicker', ['SegmentListService', 
		function(SegmentListService) {
			return {
				'restrict': 'A',
				'templateUrl': 'assets/templates/apps/data/metadatamanagement/recordlayoutmanagement/picker/_atSegmentPicker.html',
				'scope': {},
				'link': function(scope, element, attrs) {
					var parent_height = $('#segment-list-panel').outerHeight();
					var header_height = element.parent().prev().outerHeight();
					element.css({
						'height': parent_height - header_height
					});
				},
				'controller': function($scope, $element) {
					$scope.$on('preview-changed', function(e, name) {
						$scope.segments.map(function(s) {
							if(s.name !== this.name) {
								s.previewing = false;
							}
							return s;
						}, {'name': name});
					});

					$scope.segments = [];
					SegmentListService.getListForLayout(function(segments) {
						for(var i in segments) {
							var _seg = segments[i];
							if(
								_seg.name.substr(0, 3) === 'ARC' ||
								_seg.name.substr(0, 3) === 'DRC' ||
								_seg.name.substr(0, 3) === 'ZRC'
							) {
								_seg.show_in_list = false;
							} else {
								_seg.show_in_list = true;
								if(_seg.has_many_versions === false) {
									_seg.versions = [];
									_seg.versions.push({
										'id': {
											'name': _seg.name,
											'version': _seg.version
										},
										'name': (parseInt(_seg.version) / 100).toString()
									});
									_seg.has_many_versions = true;
								} else {
									_seg.versions.map(function(s) {
										s.id = {
											'name': s.name,
											'version': s.version
										};
										s.name = (parseInt(s.version) / 100).toString();
										delete s['version'];
										return s;
									});
								}

								_seg.versions.push({
									'id': {
										'name': _seg.versions[_seg.versions.length - 1].name,
										'version': 0
									},
									'name': 'Latest'
								});
							}
						}
						$scope.segments = segments;
					});
				}
			};
		}
	]);
})();