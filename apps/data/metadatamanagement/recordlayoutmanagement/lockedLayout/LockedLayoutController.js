(function(){
	var app = angular.module('atUI');

	app.controller('LockedLayoutController', ['$scope', 'RecordLayoutService', 'RecordLayoutCommonService', 'UserService', 'SegmentListService',
		function($scope, RecordLayoutService, RecordLayoutCommonService, UserService, SegmentListService) {
			$scope.layout = {};
			$scope.loadedView = null;
			$scope.other_version = null;
			$scope.versions = [];
			$scope.has_many_versions = false;

			$scope.cloneVersion = function() {
				UserService.getUserInfo(function(user) {
					RecordLayoutCommonService.clone({
						'layoutID': $scope.layout.id,
						'userID': user.userID
					}, function(id) {
						console.log(id);
					});
				});
			};

			$scope.onVersionChange = function() {
				RecordLayoutService.select($scope.other_version);
				$scope.$emit('at-layout-change-to-edit-mode');
			};

			RecordLayoutCommonService.getLatestLayout({'id': RecordLayoutService.getSelected().typeID}, function(layout, init_segments) {
				$scope.layout = layout;
				UserService.getUser($scope.layout.created.by, function(user) {
					$scope.layout.created.by = user;
				});
				UserService.getUser($scope.layout.updated.by, function(user) {
					$scope.layout.updated.by = user;
				});
				UserService.getUser($scope.layout.locked.by, function(user) {
					$scope.layout.locked.by = user;
				});
				$scope.layout.init_segments = {'arc': null, 'drc': null, 'zrc': null};

				SegmentListService.fetchByID(init_segments.arc, function(arc) {
					$scope.layout.init_segments.arc = arc.version;
				});
				SegmentListService.fetchByID(init_segments.drc, function(drc) {
					$scope.layout.init_segments.drc = drc.version
				});
				SegmentListService.fetchByID(init_segments.zrc, function(zrc) {
					$scope.layout.init_segments.zrc = zrc.version;
				});

				RecordLayoutCommonService.getTypeByID($scope.layout.type, function(type) {
					$scope.layout.type = type;
					RecordLayoutCommonService.getLayoutVersions(type.id, function(versions) {
						if(versions.length > 1) {
							$scope.has_many_versions = true;
							$scope.versions = versions.map(function(v) {
								v.decimalVersion = (v.version / 100).toString();
								return v;
							});
							$scope.other_version = $scope.versions[$scope.versions.length - 1];
						}
					});
				});

				RecordLayoutCommonService.getLayoutSegments($scope.layout.id, function(segments) {
					$scope.layout.segments = {};
					$scope.layout.segments.drc = segments;
					$scope.segment = $scope.layout.segments.drc;
					$scope.loadedView = 'assets/templates/apps/data/metadatamanagement/recordlayoutmanagement/lockedLayout/_loadedLockedLayoutView.html';
				});
			});
		}
	]);
})();