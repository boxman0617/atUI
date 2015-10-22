(function() {
	var app = angular.module('atUI');

	app.controller('EditLayoutController', ['$scope', 'RecordLayoutService', 'RecordLayoutCommonService', 'UserService', 'APIService', 'NotificationQueue', 'AlertMessageService', 'DataTypeService',
		function($scope, RecordLayoutService, RecordLayoutCommonService, UserService, APIService, NotificationQueue, AlertMessageService, DataTypeService) {
			var ref = this;

			$scope.layout = {};
			$scope.loadedView = null;
			$scope.ready = false;
			$scope.types = [];
			$scope.canEdit = true;
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
			$scope.segment = {};

			$scope.summonNewTypeModal = function() {
				DataTypeService.summon();
			};

			var unWatch = $scope.$watch('ready', function(newValue, oldValue) {
				if(newValue === true) {
					init();
					$scope.loadedView = 'assets/templates/apps/data/metadatamanagement/recordlayoutmanagement/editLayout/_loadedEditLayoutView.html';
				}
			});

			var init = function() {
				unWatch();
				if($scope.layout.locked.is) {
					$scope.setCanEdit(false);
				}

				RecordLayoutCommonService.getTypes(function(types) {
					$scope.types = types;
					for(var i in $scope.types) {
						if($scope.types[i].id === $scope.layout.type) {
							$scope.layout.type = $scope.types[i];
							break;
						}
					}
				});
			};

			RecordLayoutCommonService.getLatestLayout({'id': RecordLayoutService.getSelected().typeID}, function(layout, init_segments) {
				$scope.layout = layout;
				UserService.getUser($scope.layout.created.by, function(user) {
					$scope.layout.created.by = user;
				});
				UserService.getUser($scope.layout.updated.by, function(user) {
					$scope.layout.updated.by = user;
				});
				if($scope.layout.locked.by !== null) {
					$scope.$emit('at-layout-locked-layout');
					return;
				}
				if($scope.layout.checked_out.by !== null) {
					UserService.getUser($scope.layout.checked_out.by, function(user) {
						$scope.layout.checked_out.by = user;
					});
				}
				RecordLayoutCommonService.getInitSegments(function(p) {
					$scope.init_segments.arc = p.arc;
					$scope.init_segments.drc = p.drc;
					$scope.init_segments.zrc = p.zrc;

					$scope.init_segments.arc = RecordLayoutCommonService.addChildrenProp($scope.init_segments.arc);
					$scope.init_segments.drc = RecordLayoutCommonService.addChildrenProp($scope.init_segments.drc);
					$scope.init_segments.zrc = RecordLayoutCommonService.addChildrenProp($scope.init_segments.zrc);

					for(var seg in $scope.init_segments) {
						for(var i in $scope.init_segments[seg]) {
							if($scope.init_segments[seg][i].id === init_segments[seg]) {
								$scope.init_segments_selected[seg] = $scope.init_segments[seg][i];
								break;
							}
						}
					}

					RecordLayoutCommonService.getLayoutSegments($scope.layout.id, function(segments) {
						$scope.layout.segments = {};
						$scope.layout.segments.drc = segments;
						$scope.segment = $scope.layout.segments.drc;
						$scope.$broadcast('drc-segment-loaded');
						$scope.ready = true;
					});
				});
			});

			$scope.setCanEdit = function(status) {
				$scope.canEdit = status;
				$scope.$broadcast('layout-can-edit', status);
			};
			
			// ## Delete method
			$scope.deleteLayout = function() {
				RecordLayoutCommonService.deleteLayout($scope.layout, function() {
					NotificationQueue.push({'icon': 'thumbs-up', 'text': 'Layout is has been deleted!'});
					$scope.$emit('at-layout-reset');
				});
			};

			// ## Update method
			$scope.updateLayout = function() {
				UserService.getUserInfo(function(user) {
					$scope.layout.user = user;
					RecordLayoutCommonService.update($scope.layout, $scope.init_segments_selected, function() {
						$scope.$emit('at-layout-change-to-edit-mode');
					});
				});
			};

			// ## Lock method
			$scope.lockLayout = function() {
				UserService.getUserInfo(function(user) {
					APIService.post('layout/lock', {'id': $scope.layout.id, 'user': user, 'now': moment().format('MM/DD/YYYY')})
						.success(function(data) {
							$scope.setCanEdit(false);
							NotificationQueue.push({'icon': 'thumbs-up', 'text': 'Layout is now locked!'});
							RecordLayoutService.select(data);
							$scope.$emit('at-layout-locked-layout');
						})
						.error(function(status) {
							AlertMessageService.showError('Oh no!', 'Unable to lock layout!');
						});
				});
			};
			// ##

			// ## Check in/out Methods
			$scope.checkIn = function(cb) {
				ref.checkLayout('in', cb);
			};

			$scope.checkOut = function(cb) {
				ref.checkLayout('out', cb);
			};

			this.checkLayout = function(direction, cb) {
				UserService.getUserInfo(function(user) {
					APIService.post('layout/check/'+direction, {
						'id': $scope.layout.id,
						'user': user,
						'now': moment().format('MM/DD/YYYY')
					})
					.success(function(data) {
						if(data.checkedOutUserID === null) {
							$scope.layout.checked_out.is = false;
							$scope.layout.checked_out.on = null;
							$scope.layout.checked_out.self_checked = false;
							$scope.layout.checked_out.by = null;
						} else {
							$scope.layout.checked_out.is = true;
							$scope.layout.checked_out.on = moment(new Date(data.checkedOutDate)).format('MM/DD/YYYY');
							$scope.layout.checked_out.self_checked = true;
							$scope.layout.checked_out.by = user;
						}

						$scope.layout.updated.on = moment(new Date(data.updatedDate)).format('MM/DD/YYYY');

						NotificationQueue.push({
							'icon': 'thumbs-up',
							'text': 'Layout is now checked '+direction+'!'
						});
						cb.apply(null, []);
					})
					.error(function(status) {
						cb.apply(null, []);
						AlertMessageService.showError('Oh no!', 'Unable to check '+direction+'! ['+status+']');
					});
				});
			};
			// ##
		}
	]);
})();