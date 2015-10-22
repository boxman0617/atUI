(function() {
	var app = angular.module('atUI');

	app.directive('code', ['UserService', 'CodesService', 'CodeTableStateService',
		function(UserService, CodesService, CodeTableStateService) {
			return {
				'templateUrl': 'assets/templates/apps/data/metadatamanagement/codetablemanagement/code/_partial.html',
				'controller': function($scope) {
					$scope.isReadOnly = false;
					$scope.createdByName = '';
					$scope.updatedByName = '';
					$scope.parent = 'None';
					$scope.selected = false;
					$scope.changed = false;
					$scope.original = angular.copy($scope.code);

					var unwatch = $scope.$watchCollection('code', function(newValue, oldValue, scope) {
						if(newValue !== oldValue) {
							if(JSON.stringify(angular.copy(newValue)) !== JSON.stringify(scope.original)) {
								scope.changed = true;
							} else {
								scope.changed = false;
							}
							scope.code.changed = scope.changed;
							CodeTableStateService.state = scope.changed;
						}
					});
					
					$scope.$on('code-table-saved', function() {
						$scope.code.changed = false;
						$scope.original = angular.copy($scope.code);
						$scope.changed = false;
						CodeTableStateService.state = $scope.changed;
					});

					$scope.chooseParent = function() {
						$scope.selected = true;
						$scope.$emit('codes-parent-chooser-open', $scope.code.parentID);
					};

					$scope.$on('codes-parent-chosen', function(e, parentId) {
						if($scope.selected) {
							$scope.selected = false;
							if(parentId === null) {
								$scope.code.parentID = 0;
								$scope.parent = 'None';
							} else {
								$scope.code.parentID = parentId;
								getParent();
							}
						}
					});

					$scope.$on('codes-multiedit-deselect', function() {
						$scope.selected = false;
					});

					var getParent = function() {
						if(parseInt($scope.code.parentID) > 0) {
							CodesService.findById($scope.code.parentID, function(code) {
								$scope.parent = code;
							});
						}
					};
					getParent();

					var getUserInfo = function() {
						UserService.getUser($scope.code.createdBy, function(user) {
							$scope.createdByName = user.name;
						});
						UserService.getUser($scope.code.updatedBy, function(user) {
							$scope.updatedByName = user.name;
						});
					};
					getUserInfo();

					var isLocked = function() {
						if(parseInt($scope.code.lockedIndicator) === 'LOCKED') {
							$scope.isReadOnly = true;
						}
					};
					isLocked();

					$scope.$on('$destroy', function() {
						unwatch();
					});
				}
			};
		}
	]);
})();