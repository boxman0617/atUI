(function() {
	var app = angular.module('atUI');
	
	app.service('CodeTableStateService', [class CodeTableStateService extends Observer {
		constructor() {
			super();
			this.dirty = false;
			this.register('state');
		}
		
		set state(dirty) {
			let _old = this.dirty;
			this.dirty = dirty;
			this.notify('state', _old, this.dirty);
		}
		
		get state() {
			return this.dirty;
		}
	}]);

	app.controller('CodeTableManagementController', ['$scope', 'CodesService', 'UserService', 'AlertMessageService', 'CodeTableStateService', 'NotificationQueue', 'PlatformService', 'hotkeys',
		function($scope, CodesService, UserService, AlertMessageService, CodeTableStateService, NotificationQueue, PlatformService, hotkeys) {
			$scope.codes = [];
			$scope.deletedCodes = [];
			$scope.modalCodes = [];
			$scope.dirty = false;
			$scope.newGroupingName = '';
			$scope.trashMode = false;
			
			hotkeys.add({
				'combo': 'alt+a',
				'description': 'Add new code',
				'callback': function() {
					$scope.addNewCode();
				}
			});
			
			$scope.toggleTrashMode = function() {
				$scope.trashMode = !$scope.trashMode;
			};
			
			CodeTableStateService.watch('state', function(oldValue, newValue) {
				$scope.dirty = newValue;
			});
			
			var newCodeTemplate = {
				'groupingName': '',
				'codeValue': null,
				'shortName': null,
				'description': null,
				'comments': null,
				'parentID': 0,
				'displayOrder': 0,
				'createdBy': null,
				'createdTimestamp': null,
				'updatedBy': null,
				'updatedTimestamp': null,
				'lockedIndicator': 'NOT LOCKED',
				'changed': true,
				'platformID': null
			};
			
			$scope.deleteMe = function(code) {
				for(let i in $scope.codes) {
					if($scope.codes[i].codeID === code.codeID) {
						var d = $scope.codes.splice(i, 1);
						$scope.deletedCodes.push(d[0]);
						CodeTableStateService.state = true;
						return;
					}
				}
			};
			
			$scope.clearCodes = function() {
				$scope.codes = [];
				$scope.deletedCodes = [];
			};

			$scope.addNewCode = function() {
				UserService.getUserInfo(function(user) {
					let tmp = angular.copy(newCodeTemplate);
					tmp.createdBy = user.userID;
					tmp.updatedBy = user.userID;
					tmp.createdTimestamp = new Date();
					tmp.updatedTimestamp = new Date();
					tmp.groupingName = $scope.newGroupingName;
					tmp.codeValue = 0;
					if($scope.codes.length > 0) {
						tmp.codeValue = parseInt($scope.codes[$scope.codes.length - 1].codeValue) + 1;
					}
					tmp.platformID = PlatformService.current.id;
					$scope.codes.push(tmp);
					CodeTableStateService.state = true;
				});
			};

			$scope.$on('autocomplete-box-item-selected', function(e, group) {
				newCodeTemplate.groupingName = group;
				$scope.newGroupingName = group;
				changeCodeTable(group);
			});
			
			var changeCodeTable = function(group) {
				CodeTableStateService.state = false;
				$scope.$emit('code-table-discard-changes');
				$scope.codes = [];
				$scope.trashMode = false;
				CodesService.findByGroupingName(group, function(codes) {
					codes.sort(function(a, b) {
						if(parseInt(a.code_value) < parseInt(b.code_value)) {
							return -1;
						}
						if(parseInt(a.code_value) > parseInt(b.code_value)) {
							return 1;
						}
						return 0;
					}).map(function(c) {
						c.changed = false;
						return c;
					});
					$scope.codes = angular.copy(codes);
				});
			};
			
			$scope.$on('autocomplete-box-modal-item-selected', function(e, group) {
				_itemSelected(group);
			});
			
			var _itemSelected = function(group) {
				$scope.trashMode = false;
				CodeTableStateService.state = false;
				$scope.modalCodes = [];
				CodesService.findByGroupingName(group, function(codes) {
					codes.sort(function(a, b) {
						if(parseInt(a.code_value) < parseInt(b.code_value)) {
							return -1;
						}
						if(parseInt(a.code_value) > parseInt(b.code_value)) {
							return 1;
						}
						return 0;
					});
					$scope.modalCodes = codes;
				});
			};
			
			$scope.cancel = function() {
				$scope.clearCodes();
				$scope.trashMode = false;
				$scope.$broadcast('cancel-new-group');
			};

			$scope.saveChanges = function() {
				let changedCodes = [];
				for(let code of $scope.codes) {
					if(code.changed) {
						if(code.shortName === null || code.shortName === '') {
							NotificationQueue.push({
								'text': 'Invalid codes found! Please fix.',
								'icon': 'thumbs-o-down'
							});
							return;
						}
						changedCodes.push(code);
					}
				}
				CodesService.save({
					'codes': changedCodes,
					'deleted': $scope.deletedCodes
				}, function() {
					NotificationQueue.push({
						'text': 'Saved all changed!',
						'icon': 'thumbs-o-up'
					});
					$scope.cancel();
					$scope.trashMode = false;
					let group = $scope.newGroupingNamee;
					CodesService.clearSpecificCache('code/name/'+group);
					_itemSelected(group);
					$scope.$broadcast('code-table-saved');
				});
			};
		}
	]);
})();