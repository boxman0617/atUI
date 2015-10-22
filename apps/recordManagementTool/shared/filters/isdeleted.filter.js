(function() {
	angular.module('atUI').filter('isDeleted', function() {
		return function(records) {
			var filtered = [];
			angular.forEach(records, function(record) {
				if(!record.isDeleted)
					filtered.push(record);
			});
			return filtered;
		};
	});
})();