(function() {
	angular.module('atUI').service('RecordsService', [function() {

		var _records = [];

		this.put = function(record) {
			_records.push(record);
		};

		this.set = function(records) {
			_records = records;
		};

		this.get = function(key) {
			return _records[key];
		};

		this.getAll = function() {
			return _records;
		};

		this.clearAll = function() {
			_records = [];
		};

	}]);
})();