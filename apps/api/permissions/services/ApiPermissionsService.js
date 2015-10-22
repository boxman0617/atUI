(function() {
	var app = angular.module('atUI');
	
	var service = function(APIService) {
		var _apis = [],
		_onUp = null,
		_FETCH = 'api',
		_SAVE = 'api',
		_CREATE = 'api',
		_DELETE = 'api/',
		_GET_PERMS = 'api/{id}/permissions';
		
		this.fetch = function(cb) {
			APIService.get(_FETCH).success(function(data) {
				_apis = data.sort(function(a, b) {
					if(a.path < b.path) {
						return -1;
					}
					if(a.path > b.path) {
						return 1;
					}
					return 0;
				});
				cb.apply(null, [_apis]);
			});
		};
		
		this.getPermissions = function(id, cb) {
			APIService.get(_GET_PERMS.replace('{id}', id)).success(function(res) {
				cb.apply(null, [res]);
			});
		};
		
		this.save = function(permission, cb) {
			APIService.post(_SAVE, permission).success(function(res) {
				cb.apply(null, [res]);
			});
		};
		
		this.create = function(permission, cb) {
			APIService.put(_CREATE, permission).success(function(res) {
				cb.apply(null, [res]);
			});
		};
		
		this.delete = function(id, cb) {
			APIService.delete(_DELETE+id).success(function() {
				cb.apply(null, []);
			});
		};
		
		this.onUp = function(cb) {
			_onUp = cb;
		};
		
		this.up = function(mode) {
			_onUp.apply(null, [mode]);
		};
	};
	
	app.service('ApiPermissionsService', ['APIService', service]);
})();