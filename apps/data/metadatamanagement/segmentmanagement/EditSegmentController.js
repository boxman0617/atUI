(function() {
	var app = angular.module('atUI');

	app.controller('EditSegmentController', ['$scope', 'AlertMessageService', 'UserService', 'LookupDatasetService', 'APIService', 'SegmentListService', 'NotificationQueue', 'UndoService', 'hotkeys', 'SegmentService', 'ModalService',

		function($scope, AlertMessageService, UserService, LookupDatasetService, APIService, SegmentListService, NotificationQueue, UndoService, hotkeys, SegmentService, ModalService) {
			$scope.ready = false;
			$scope.cloneInProgress = false;
			$scope.segment = null;
			$scope.lookupDataset = LookupDatasetService.data;
			$scope.readStatus = {'amIReadOnly': false};
			$scope.user = null;
			$scope.loadedView = null;

			hotkeys.bindTo($scope)
				.add({
					'combo': 'alt+1',
					'description': 'Add new field row',
					'callback': function() {
						$scope.addNewField();
					}
				});

			var getVersions = function() {
				SegmentService.getVersions($scope.segment.name, function(versions) {
					if(versions.length > 1) {
						$scope.segment.versions = versions.map(function(a) {
							return {
								'id': a.id,
								'name': parseFloat(a.version / 100)
							};
						});
						$scope.segment.has_many_versions = true;
					}
					$scope.ready = true;
				});
			};
			
			if(SegmentListService.data.selectedByID === null) {
				SegmentListService.fetchLatestSegment(SegmentListService.getSelected().name, function(segment) {
					$scope.segment = segment;
					getVersions();
				});
			} else {
				SegmentListService.fetchByID(SegmentListService.data.selectedByID, function(segment) {
					$scope.segment = segment;
					getVersions();
				});
			}

			LookupDatasetService.refresh();

			var unWatch = $scope.$watch('ready', function(newValue, oldValue) {
				if(newValue === true) {
					init();
					$scope.loadedView = 'assets/templates/apps/data/metadatamanagement/segmentmanagement/_loadedEditSegmentView.html';
				}
			});

			var init = function() {
				unWatch();
				if($scope.segment.hasOwnProperty('versions')) {
					var version_i = $scope.segment.versions.length - 1;
					for(var i in $scope.segment.versions) {
						if($scope.segment.versions[i].id === $scope.segment.id) {
							version_i = i;
							break;
						}
					}
					$scope.version_data = {
						'other_version': $scope.segment.versions[version_i]
					};

					$scope.$watch('version_data.other_version', function(newValue, oldValue) {
						if(newValue !== oldValue) {
							SegmentListService.data.selectedByID = $scope.version_data.other_version.id;
							$scope.$emit('at-change-to-edit-mode');
						}
					});
				}

				$scope.$watch('segment.locked', function(newValue, oldValue) {
					if(newValue !== oldValue) {
						isReadOnly();
					}
				});

				var _removeFieldsUndoCache = null;
				$scope.$watchCollection('segment.fields', function(newValue, oldValue) {
					if(newValue.length !== oldValue.length && newValue.length < oldValue.length) {
						_removeFieldsUndoCache = oldValue;
						UndoService.triggerMessage('Removed field from segment.')
							.onUndo(function() {
								$scope.segment.fields = _removeFieldsUndoCache;
							})
							.onDismiss(function() {
								_removeFieldsUndoCache = null;
							});
					}
				});

				isReadOnly();

				UserService.getUserInfo(function(user) {
					$scope.user = user;
				});
			};

			isReadOnly = function() {
				UserService.getUserInfo(function(user) {
					if($scope.segment.locked.is) {
						$scope.readStatus.amIReadOnly = true;
						return true;
					}
					if($scope.segment.checked_out.is) {
						if(parseInt($scope.segment.checked_out.by.userID) !== parseInt(user.userID)) {
							$scope.readStatus.amIReadOnly = true;
							return true;
						}
					}
					$scope.readStatus.amIReadOnly = false;
				});
			};

			$scope.canIUpdate = function() {
				if(!$scope.ready) {
					return !false;
				}
				if($scope.readStatus.amIReadOnly) {
					return !false;
				}
				if($scope.segment.name !== null && $scope.segment.name !== '') {
					if($scope.segment.version !== null && $scope.segment.version !== '') {
						if($scope.segment.shortDescription !== null && $scope.segment.shortDescription !== '') {
							if($scope.segment.fields[0].name !== null && $scope.segment.fields[0].name !== '') {
								return !true;
							}
						}
					}
				}
				return !false;
			};

			$scope.cloneVersion = function() {
				AlertMessageService.showQuestion('Hold on!', 'This will create a new version of this segment. Is that ok?', [
					{
						'label': 'Yes',
						'class': 'btn-primary',
						'action': function() {
							doVersionClone();
						},
						'dismiss': true
					},
					{
						'label': 'Cancel',
						'class': 'btn-default',
						'action': function() {},
						'dismiss': true
					}
				]);
			};

			var doVersionClone = function() {
				if($scope.cloneInProgress === false) {
					$scope.cloneInProgress = true;
					UserService.getUserInfo(function(user) {
						var now = moment().format('MM/DD/YYYY');
						var new_segment = angular.copy($scope.segment);
						delete new_segment['id'];
						delete new_segment['has_many_versions'];
						delete new_segment['isSelected'];
						delete new_segment['show_in_list'];
						delete new_segment['versions'];

						new_segment.checked_out = {
							'is': true,
							'by': user,
							'on': now
						};
						new_segment.locked = {
							'is': false,
							'by': null,
							'on': null
						};
						new_segment.created = {
							'by': user,
							'on': now
						};
						new_segment.updated = {
							'by': user,
							'on': now
						};
						new_segment.version = -1;

						SegmentService.create(new_segment)
							.success(function(data) {
								SegmentListService.refresh(function(s) {
									NotificationQueue.push({
										'icon': 'thumbs-up',
										'text': 'New version was created!'
									});

									$scope.$emit('at-change-to-edit-mode');
									$scope.cloneInProgress = false;
								});
							})
							.error(function(err) {
								$scope.cloneInProgress = false;
								AlertMessageService.showError('Unable to create segment version!');
							});
					});
				}
			};

			$scope.addNewField = function() {
				if(!$scope.readStatus.amIReadOnly) {
					$scope.segment.fields.push({
						'name': null,
						'fieldNumber': null,
						'description': null,
						'dataTypeName': null,
						'length': null,
						'codetableName': null
					});
				}
			};

			$scope.updateSegment = function() {
				$scope.segment.updated.on = moment().format('MM/DD/YYYY');
				SegmentService.update($scope.segment)
					.success(function(data) {
						SegmentListService.refresh(function(s) {
							SegmentListService.select($scope.segment);

							NotificationQueue.push({
								'icon': 'thumbs-up',
								'text': 'Your Segment has been updated!'
							});

							$scope.$emit('at-change-to-edit-mode');
						});
					})
					.error(function(err) {
						AlertMessageService.showError('Unable to update segment! ['+err+']');
					});
			};

			$scope.segmentLockedMessage = function(is) {
				if(is) {
					return 'Segment is Locked!';
				}
				return 'Segment is Unlocked!';
			};

			$scope.segmentCheckedOutMessage = function(is) {
				if(is) {
					return 'Segment is Checked Out!';
				}
				return 'Segment is not Checked Out!';
			};

			$scope.lockSegment = function() {
				UserService.getUserInfo(function(user) {
					SegmentService.lock({'id': $scope.segment.id, 'userID': user.userID})
						.success(function(userID) {
							UserService.getUser(userID, function(user) {
								$scope.segment.locked = {
									'is': true,
									'on': moment().format('MM/DD/YYYY'),
									'by': user
								};
							});
							NotificationQueue.push({'icon': 'thumbs-up', 'text': 'Segment is now locked!'});
						})
						.error(function(status) {
							AlertMessageService.showError('Oh no!', 'Unable to lock segment!');
						});
				});
			};
			
			$scope.dependentLayouts = [];
			$scope.deleteSegment = function() {
				SegmentService.checkForDelete($scope.segment, function(data) {					
					if(data !== null && data.length > 0) {
						$scope.dependentLayouts = data;
						ModalService.summon('segment-dependent-modal');
					} else {
						SegmentService.deleteSegment($scope.segment, function() {
							NotificationQueue.push({'icon': 'thumbs-up', 'text': 'Segment was deleted!'});
							$scope.reset();
						});
					}
				});
			};
			
			$scope.reset = function() {
				$scope.$emit('at-segment-reset');
			};

			$scope.checkIn = function(cb) {
				checkSegment('in', cb);
			};

			$scope.checkOut = function(cb) {
				checkSegment('out', cb);
			};

			var checkSegment = function(direction, cb) {
				UserService.getUserInfo(function(user) {
					SegmentService.check(direction, {
						'id': $scope.segment.id,
						'userID': user.userID,
					}).success(function(data) {
						UserService.getUser(data.userID, function(user) {
							$scope.segment.checked_out = {
								'is': data.is,
								'on': moment().format('MM/DD/YYYY'),
								'by': user
							};
						});
						NotificationQueue.push({
							'icon': 'thumbs-up',
							'text': 'Segment is now checked '+direction+'!'
						});
						cb();
					})
					.error(function(status) {
						cb();
						AlertMessageService.showError('Oh no!', 'Unable to check '+direction+'! ['+status+']');
					});
				});
			};
		}
	]);
})();