(function() {
	var app = angular.module('atUI');

	app.service('CodesService', ['AjaxQueueService', 'APIService', 'PlatformService',
		function(AjaxQueueService, APIService, PlatformService) {
			var _BY_ID = 'code/',
			_BY_NAME = 'code/name/',
			_FETCH = 'code',
			_FETCH_GROUPS = 'code/groups',
			_SAVE = 'code',
			_DELETE_GROUPING = 'code/group/';
			AjaxQueueService.register('code');
			AjaxQueueService.turnOffCaching();
			
			this.fetchGroups = function(cb) {
				APIService.get(_FETCH_GROUPS+'/p/'+PlatformService.current.id).success(function(groups) {
					cb(groups);
				});
			};
			
			this.fetch = function(cb) {
				AjaxQueueService.addToQueue(_FETCH, 'code', cb);
			};

			this.findById = function(id, cb) {
				AjaxQueueService.addToQueue(_BY_ID+id, 'code', cb);
			};
			
			this.findByGroupingName = function(name, cb) {
				APIService.get(_BY_NAME+name+'/p/'+PlatformService.current.id).success(function(codes) {
					cb.apply(null, [codes]);
				});
			};
			
			this.clearCache = function() {
				AjaxQueueService.clearCache('code');
			};
			
			this.clearSpecificCache = function(call) {
				AjaxQueueService.clearSpecificCache('code', call);
			};
			
			this.save = function(codes, cb) {
				APIService.post(_SAVE, {
					'codes': _preprocessCodes(codes.codes),
					'deleted': _preprocessCodes(codes.deleted)
				}).success(function() {
					cb.apply(null, []);
				});
			};
			
			this.deleteGrouping = function(codeGroupName, cb) {
				APIService.delete(_DELETE_GROUPING+codeGroupName+'/p/'+PlatformService.current.id).success(function() {
					cb.apply(null, []);
				});
			};
			
			var _preprocessCodes = function(codes) {
				return codes.map(function(code) {
					delete code['changed'];
					if(code.lockedIndicator === 'NOT LOCKED') {
						code.lockedIndicator = 0;
					} else {
						code.lockedIndicator = 1;
					}
					return code;
				});
			};
		}
	]);
})();