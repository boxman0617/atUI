(function() {
	var app = angular.module('atUI');
	
	var controller = function($scope, ApiPermissionsService, $sce, UsersService) {
		$scope.apis = [];
		$scope.iC = null;
		$scope.methods = ['GET', 'POST', 'PUT', 'DELETE'];
		$scope.users = [];
		$scope.groups = [];
		
		ApiPermissionsService.fetch(function(apis) {
			$scope.apis = apis;
		});
		
		UsersService.getAllUsers(function(users) {
			$scope.users = users;
		});
		UsersService.getAllGroups(function(groups) {
			$scope.groups = groups;
		});
		
		$scope.prettyPath = function(api) {
			var path = api.path;
			return path
				.replace(/(\/services\/gbp)(.+)/i, '<span class="path-prefix">$1</span><span class="path-call">$2</span>')
				.replace(/(\{[0-9a-zA-Z_]+\})/g, '<span class="path-param">$1</span>');
		};
		
		$scope.onEdit = function(api) {
			$scope.iC = api;
			ApiPermissionsService.up('edit');
		};
		$scope.startNew = function() {
			ApiPermissionsService.up('new');
		};
		$scope.onDelete = function(api) {
			ApiPermissionsService.delete(api.methodID, function() {
				for(var index in $scope.apis) {
					if($scope.apis[index].methodID === api.methodID) {
						$scope.apis.splice(index, 1);
						break;
					}
				}
			});
		};
	};
	
	app.controller('ApiPermissionsController', ['$scope', 'ApiPermissionsService', '$sce', 'UsersService', controller]);
	
	var apiModal = function(ApiPermissionsService) {
		return {
			'controller': function($scope, $element) {
				$scope.edit = null;
				$scope.perms = {
					'groups': {},
					'users': {}
				};
				var _mode = 'edit';
				
				ApiPermissionsService.onUp(function(mode) {
					if(mode === 'edit') {
						$scope.edit = angular.copy($scope.iC);
						ApiPermissionsService.getPermissions($scope.edit.methodID, function(perm) {
							for(var p in perm) {
								if(perm[p].controlType === 'GROUP') {
									$scope.perms.groups[perm[p].controlID] = true;
								} else {
									$scope.perms.users[perm[p].controlID] = true;
								}
							}
						});
					} else {
						$scope.edit = {
							'path': '/services/gbp/',
							'requestMethod': 'GET',
							'description': null
						};
					}
					_mode = mode;
					$element.modal();
				});
				
				$element.on('hidden.bs.modal', function() {
					$scope.iC = null;
					$scope.edit = null;
					$scope.perms.users = {};
					$scope.perms.groups = {};
				});
				
				$element.on('shown.bs.modal', function() {
					$element.find('#requestMethod').focus();
				});
				
				$scope.save = function() {
					if(_mode === 'edit') {
						ApiPermissionsService.save({
							'accessMethod': $scope.edit,
							'accessControl': $scope.perms
						}, function(api) {
							for(var index in $scope.apis) {
								if($scope.apis[index].methodID === api.methodID) {
									$scope.apis[index] = api;
									break;
								}
							}
							$element.modal('hide');
						});
					} else {
						ApiPermissionsService.create({
							'accessMethod': $scope.edit,
							'accessControl': $scope.perms
						}, function(api) {
							$scope.apis.push(api);
							$element.modal('hide');
						});
					}
				};
			}
		};
	};
	
	app.directive('apiModal', ['ApiPermissionsService', apiModal]);
})();