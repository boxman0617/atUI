(function() {
	angular.module('atUI').service('FilesService', [function() {
		
		var _files = [];

		this.put = function(file) {
			_files.push(file);
		};

		this.set = function(files) {
			_files = files;
		};

		this.get = function(key) {
			return _files[key];
		};

		this.getAll = function() {
			return _files;
		};

		this.clearAll = function() {
			_files = [];
		};

	}]);
})();