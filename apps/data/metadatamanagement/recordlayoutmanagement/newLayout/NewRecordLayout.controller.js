(function() {
	var app = angular.module('atUI');

	// ## Controller: NewLayoutController
	app.controller('NewLayoutController', [
	'$scope', '$log', 'RecordLayoutService', 'UserService', 'AlertMessageService', 'SegmentPreviewService', 'NotificationQueue', 'RecordLayoutCommonService', 'DataTypeService',
		function($scope, $log, RecordLayoutService, UserService, AlertMessageService, SegmentPreviewService, NotificationQueue, RecordLayoutCommonService, DataTypeService) {
			var ref = this;
			var nowNow = moment().format('MM/DD/YYYY');
			
			// ## Setup new layout object
			$scope.layout = {
				'type': null,
				'description': null,
				'version': '0.1',
				'platformID': null,
				'created': {
					'on': nowNow,
					'by': null
				},
				'updated': {
					'on': nowNow,
					'by': null,
				},
				'locked': {
					'is': false,
					'on': null,
					'by': null
				},
				'checked_out': {
					'is': true,
					'on': nowNow,
					'by': null
				},
				'segments': {
					'drc': {}
				}
			};
			$scope.segment = null;

			$scope.types = [];

			$scope.summonNewTypeModal = function() {
				DataTypeService.summon();
			};

			$scope.$on('datatype-refresh', function(e, type) {
				type = type || null;
				fetchTypes(function() {
					if(type !== null) {
						var i = $scope.types.map(function(m) {
							return m.name;
						}).indexOf(type.name);
						$scope.layout.type = $scope.types[i];
					}
				});
			});

			var fetchTypes = function(cb) {
				cb = cb || null;
				RecordLayoutCommonService.getTypes(function(types) {
					$scope.types = types.filter(function(t) {
						var i = this.layouts.map(function(l) {
							return l.name;
						}).indexOf(t.name);
						if(i === -1) {
							return true;
						}
						return false;
					}, {'layouts': RecordLayoutService.data.list});
					$scope.layout.type = $scope.types[0];
					if(cb !== null) {
						cb.apply(null, []);
					}
				});
			};
			fetchTypes();

			UserService.getUserInfo(function(data) {
				$scope.layout.created.by = data;
				$scope.layout.updated.by = data;
				$scope.layout.checked_out.by = data;
			});
			// ##
			
			// ## Segment Preview Setup
			$scope.preview = SegmentPreviewService.data;
			// ##

			// ## Initial Segments Setup
			$scope.init_segments = {
				'arc': [],
				'drc': [],
				'zrc': []
			};
			$scope.init_segments_selected = {
				'arc': null,
				'drc': null,
				'zrc': null
			};

			RecordLayoutCommonService.getInitSegments(function(p) {
				$scope.init_segments.arc = p.arc;
				$scope.init_segments.drc = p.drc;
				$scope.init_segments.zrc = p.zrc;

				$scope.init_segments.arc = RecordLayoutCommonService.addChildrenProp($scope.init_segments.arc);
				$scope.init_segments.drc = RecordLayoutCommonService.addChildrenProp($scope.init_segments.drc);
				$scope.init_segments.zrc = RecordLayoutCommonService.addChildrenProp($scope.init_segments.zrc);

				$scope.init_segments_selected.arc = $scope.init_segments.arc[$scope.init_segments.arc.length - 1];
				$scope.init_segments_selected.drc = $scope.init_segments.drc[$scope.init_segments.drc.length - 1];
				$scope.init_segments_selected.zrc = $scope.init_segments.zrc[$scope.init_segments.zrc.length - 1];

				$scope.layout.segments.drc = angular.copy($scope.init_segments_selected.drc);
				$scope.segment = $scope.layout.segments.drc;				

				$scope.$broadcast('drc-segment-loaded');
			});
			// ##
			
			// ## Status info
			$scope.lockedMessage = function(is) {
				if(is) {
					return 'Layout is locked!'
				}
				return 'Layout is unlocked!';
			};
			$scope.checkedOutMessage = function(is) {
				if(is) {
					return 'Layout is Checked Out!';
				}
				return 'Layout is not Checked Out!';
			};
			// ##
			
			// ## Create New Layout flow
			$scope.createNewLayout = function() {
				RecordLayoutCommonService.create($scope.layout, $scope.init_segments_selected, function(layout) {
					RecordLayoutService.refresh(function(s) {
						RecordLayoutService.select(layout);

						NotificationQueue.push({
							'icon': 'thumbs-up',
							'text': 'Your Layout has been created!'
						});

						$scope.$emit('at-layout-change-to-edit-mode');
					});
				});
			};
		}
	]);
})();