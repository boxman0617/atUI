(function() {
	angular.module('atUI').service('UserService', ['APIService', 'AlertMessageService', 'jwtHelper', 'AjaxQueueService', '$q',
		function(APIService, AlertMessageService, jwtHelper, AjaxQueueService, $q) {
			var _queue = [];

			var _userCache = {};
			var _currentUser = false;
			var _userImgPath = 'http://zoomglobal/my/User%20Photos/Profile%20Pictures/{USER_ID}_MThumb.jpg?t=';

			var _checkCache = function(id) {
				if(_userCache.hasOwnProperty(id)) {
					return _userCache[id];
				}
				return false;
			};

			var _cache = function(user) {
				_userCache[user.userID] = user;
			};
			
			AjaxQueueService.register('userService');
			
			this.searchForUser = function(query, cb) {
				APIService.get('user/q/'+query).success(function(users) {
					cb.apply(null, [users]);
				});
			};
			
			this.getFilePermissions = function(cb) {
				APIService.get('user/file_permissions')
					.success(function(data) {
						cb(data);
					})
					.error(function(status) {
						AlertMessageService.showError('Oh No!', 'Unable to get user information! ['+status+']');
					});
			};
			
			this.getPerspectives = function(cb) {
				APIService.get('user/perspectives')
					.success(function(data) {
						data.sort(function(a, b) {
							if(a.rank > b.rank)
								return -1;
							if(a.rank < b.rank)
								return 1;
							return 0;
						});
						for(var i in data) {
							data[i].active = false;
						}
						data[data.length-1].active = true;
						cb(data);
					});
			};

			this.getUser = function(id, cb) {
				AjaxQueueService.addToQueue('user/id/'+id, 'userService', function(user) {
					cb.apply(null, [user]);
				});
			};
			
			this.ping = function(cb) {
				APIService.get('ping').success(function(token) {
					var claims = jwtHelper.decodeToken(token);
					cb.apply(null, []);
				});
			};

			this.touch = function(cb) {
				APIService.get('user/info').success(function() {
					cb();
				});
			};
			
			this.getUserImage = function(cb) {
				var self = this;
				this.getUserInfo(function(user) {
					self.getThisUserImage(user, cb);
				});
			};
			
			this._getImageUrl = function(user) {
				return _userImgPath.replace('{USER_ID}', user.logonID.toLowerCase())+Date.now();
			};
			
			this._checkIfImage = function(url) {
				var deferred = $q.defer();

			    var image = new Image();
			    image.onerror = function() {
			        deferred.resolve(false);
			    };
			    image.onload = function() {
			        deferred.resolve(true);
			    };
			    image.src = url;

			    return deferred.promise;
			};
			
			this.getThisUserImage = function(user, cb) {
				var url = this._getImageUrl(user);
				this._checkIfImage(url).then(function(r) {
					if(r) {
						return cb.apply(null, [url]);
					}
					cb.apply(null, ['/assets/img/user.jpg']);
				});
			};

			this.getUserInfo = function(cb) {
				cb = cb || null;
				AjaxQueueService.addToQueue('user/info', 'userService', function(user) {
					if(cb !== null) {
						cb.apply(null, [user]);
					}
				});
			};
		
		}
	]);
})();