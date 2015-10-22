(function() {
	var app = angular.module('atUI');

	app.service('LookupDatasetService', ['APIService', 'AlertMessageService', function(APIService, AlertMessageService) {
		this.data = {
			'cache': []
		};

		this.refresh = function(cb) {
			cb = cb || null;
			var ref = this;
			APIService.get('codes/distinct')
				.success(function(data) {
					ref.data.cache = data;
					if(cb !== null) {
						cb(true);
					}
				})
				.error(function(err, status) {
					AlertMessageService.showError('Oh no!', 'Unable to fetch lookup dataset! ['+status+']');
					if(cb !== null) {
						cb(false);
					}
				});
		};
	}]);
})();