(function() {
	var app = angular.module('atUI');

	app.controller('NewSegmentController', ['$scope', 'AlertMessageService', 'UserService', 'LookupDatasetService', 'APIService', 'SegmentListService', 'NotificationQueue', 'SegmentService',
		function($scope, AlertMessageService, UserService, LookupDatasetService, APIService, SegmentListService, NotificationQueue, SegmentService) {

			var nowNow = moment().format('MM/DD/YYYY');

			$scope.segment = {
				'name': null,
				'shortDescription': null,
				'version': '0.1',
				'description': null,
				'fields': [
					{
						'name': null,
						'fieldNumber': null,
						'description': null,
						'dataTypeName': 'STRING',
						'length': null,
						'codetableName': null
					}
				],
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
				}
			};

			$scope.lookupDataset = LookupDatasetService.data;
			LookupDatasetService.refresh();

			$scope.canCreate = function() {
				if($scope.UniqueSegmentNameForm.$invalid) {
					return !false;
				}
				if(angular.isDefined($scope.segment.name) && $scope.segment.name !== null && $scope.segment.name !== '') {
					if(angular.isDefined($scope.segment.version) && $scope.segment.version !== null && $scope.segment.version !== '') {
						if(angular.isDefined($scope.segment.shortDescription) && $scope.segment.shortDescription !== null && $scope.segment.shortDescription !== '') {
							if(angular.isDefined($scope.segment.fields[0].name) && $scope.segment.fields[0].name !== null && $scope.segment.fields[0].name !== '') {
								return !true;
							}
						}
					}
				}
				return !false;
			};

			$scope.addNewField = function() {
				$scope.segment.fields.push({
					'name': null,
					'fieldNumber': null,
					'description': null,
					'dataTypeName': null,
					'length': null,
					'codetableName': null
				});
			};

			$scope.createNewSegment = function() {
				SegmentService.create($scope.segment)
					.success(function(data) {
						SegmentListService.refresh(function(s) {
							NotificationQueue.push({
								'icon': 'thumbs-up',
								'text': 'Your Segment has been created!'
							});
							SegmentListService.select($scope.segment);

							$scope.$emit('at-change-to-edit-mode');
						});
					})
					.error(function(err) {
						AlertMessageService.showError('Unable to create segment! ['+err+']');
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

			UserService.getUserInfo(function(data) {
				$scope.segment.created.by = data;
				$scope.segment.updated.by = data;
				$scope.segment.checked_out.by = data;
			});

		}
	]);
})();