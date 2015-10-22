(function() {
	var app = angular.module('atUI');
	
	function GroupsModal(APIService, AdminModalService, UsersService, NotificationQueue) {
		return {
			'controller': function($scope, $element) {
				$scope.group = {};
				$scope.users = [];
				$scope.usersOut = [];
				$scope.usersToRemove = [];
				$scope.usersToMove = [];
				
				AdminModalService.register('groups', function(group = {}) {
					$scope.group = group;
					UsersService.getAllUsers(function(users) {
						$scope.users = users;
					});
					
					if($scope.group.hasOwnProperty('groupID')) {
						UsersService.getUsersOfGroup($scope.group.groupID).success(function(u) {
							$scope.usersOut = u;
							
							$scope.users = $scope.users.filter(function(e, i, a) {
								for(let u of this.users) {
									if(e.userID === u.userID) {
										return false;
									}
								}
								return true;
							}, {'users': u});
						});
					}
					
					$element.modal();
				});
				
				$scope.moveUsers = function() {
					for(let userID of $scope.usersToMove) {
						let fI = $scope.users.map(function(x) {
							return parseInt(x.userID);
						}).indexOf(parseInt(userID));
						
						$scope.usersOut.push($scope.users[fI]);
						$scope.users.splice(fI, 1);
					}
					$scope.usersToMove = [];
				};
				
				$scope.removeUsers = function() {
					for(let userID of $scope.usersToRemove) {
						let fI = $scope.usersOut.map(function(x) {
							return parseInt(x.userID);
						}).indexOf(parseInt(userID));
						
						$scope.users.push($scope.usersOut[fI]);
						$scope.usersOut.splice(fI, 1);
					}
					$scope.usersToRemove = [];
				};
				
				$scope.save = function() {
					if($scope.group.hasOwnProperty('name') === false || $scope.group.name === null || $scope.group.name === '') {
						NotificationQueue.push({
							'icon': 'frown-o',
							'text': 'Group needs a name!'
						});
						return;
					}
					if($scope.group.hasOwnProperty('description') === false || $scope.group.description === null || $scope.group.description === '') {
						NotificationQueue.push({
							'icon': 'frown-o',
							'text': 'Group needs a description!'
						});
						return;
					}
					APIService.post('group', {
						'group': $scope.group,
						'users': $scope.usersOut
					}).success(function(res) {
						UsersService.clearCache('groups');
						NotificationQueue.push({
							'icon': 'thumbs-o-up',
							'text': 'Group saved!'
						});
						$scope.$broadcast('groups-controller-refresh');
						$element.modal('hide');
					});
				};
			}
		};
	}
	
	app.directive('groupsModal', ['APIService', 'AdminModalService', 'UsersService', 'NotificationQueue', GroupsModal]);
})();