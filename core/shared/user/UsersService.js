(function() {
	var app = angular.module('atUI');

	app.service('UsersService', ['AjaxQueueService', 'localStorageService', 'APIService',
		function(AjaxQueueService, localStorageService, APIService) {
			AjaxQueueService.register('users');
			var _usersCache = {
				'data': [],
				'expireOn': null
			};
			var _groupsCache = {
					'data': [],
					'expireOn': null
				};

			this.findUserById = function(id, cb) {
				AjaxQueueService.addToQueue('user/info/'+id, 'users', cb);
			};
			
			this.clearCache = function(which) {
				if(which === 'groups') {
					_groupsCache = {
						'data': [],
						'expireOn': null
					};
				} else {
					_usersCache = {
						'data': [],
						'expireOn': null
					};
				}
			};
			
			this.deleteGroup = function(group, cb) {
				APIService.delete('group/'+group.groupID).success(function() {
					cb.apply(null, []);
				});
			};
			
			this.ldapSearch = function(surname, cb) {
				APIService.get('user/q/'+surname).success(function(results) {
					
					let r = [];
					let count = 0;
					
					for(let i in results) {
						count = results[i].length;
						break;
					}
					
					for(let i = 0; i < count; i++) {
						let tmp = {};
						for(let o in results) {
							tmp[o] = results[o][i];
						}
						r.push(tmp);
					}
					
					cb.apply(null, [r]);
				});
			};
			
			this.getAllUsers = function(cb) {
				var users = _usersCache.data;
				if(users.length === 0) {
					users = localStorageService.get('users');
					if(users === null) {
						return AjaxQueueService.addToQueue('api/users', 'users', function(_users) {
							_usersCache.data = _users;
							_usersCache.expireOn = (new Date()).setDate((new Date()).getDate() + 1);
							localStorageService.set('users', _usersCache);
							cb.apply(null, [_usersCache.data]);
						});
					} else {
						if(users.expireOn > new Date()) {
							localStorageService.remove('users');
						}
						users = users.data;
					}
				}
				return cb.apply(null, [users]);
			};
			
			this.getUsersOfGroup = function(groupID) {
				return APIService.get('group/'+groupID+'/users');
			};
			
			this.getAllGroups = function(cb) {
				var groups = _groupsCache.data;
				if(groups.length === 0) {
					groups = localStorageService.get('groups');
					if(groups === null) {
						return AjaxQueueService.addToQueue('api/groups', 'users', function(_groups) {
							_groupsCache.data = _groups;
							_groupsCache.expireOn = (new Date()).setDate((new Date()).getDate() + 1);
							localStorageService.set('groups', _groupsCache);
							cb.apply(null, [_groupsCache.data]);
						});
					} else {
						if(groups.expireOn > new Date()) {
							localStorageService.remove('groups');
						}
						groups = groups.data;
					}
				}
				return cb.apply(null, [groups]);
			};
		}
	]);
})();