(function() {
	angular.module('atUI').service('LookupService', ['APIService', function(APIService) {
		
		this.get = function(lookup_group, cb) {
			APIService.get(lookup_group)
				.success(function(data) {
					cb(data);
				})
				.error(function(status) {
					AlertMessageService.showError('Lookup Error', 'Unable to get lookup group! ['+status+']');
				});
		};
		
	}]);
})();